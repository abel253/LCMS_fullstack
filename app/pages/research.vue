<!-- pages/research.vue -->
<template>
  <div class="research-page">
    <!-- Hero -->
    <section class="gradient-hero py-16">
      <div class="container-custom text-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">📄 Digital Research Repository</h1>
        <p class="text-primary-100 max-w-2xl mx-auto">
          Share and discover research papers, proposals, and academic projects from students and faculty.
        </p>
      </div>
    </section>

    <div class="container-custom py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Upload Form - Left Side -->
        <div class="lg:col-span-1">
          <div class="card p-6">
            <h3 class="text-xl font-bold text-primary-800 mb-4">📤 Upload Research</h3>
            <form @submit.prevent="handleUpload" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Research Title *</label>
                <input v-model="form.title" type="text" class="input-field" placeholder="Enter title..." required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">College *</label>
                <select v-model="form.college" class="input-field" required>
                  <option value="">Select College</option>
                  <option value="Natural Science">Natural Science</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Business & Economics">Business & Economics</option>
                  <option value="Technology">Technology</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <input v-model="form.department" type="text" class="input-field" placeholder="Department..." required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">File (PDF/Doc) *</label>
                <input type="file" accept=".pdf,.doc,.docx" @change="handleFileChange" class="w-full" required />
              </div>

              <button type="submit" class="btn-primary w-full" :disabled="uploading">
                {{ uploading ? 'Uploading...' : 'Submit to Library' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Research List - Right Side -->
        <div class="lg:col-span-2">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 class="text-xl font-bold text-gray-800">Recent Submissions</h3>
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search by title..."
              class="input-field sm:w-64"
              @input="handleSearch"
            />
          </div>

          <div class="table-wrapper">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>College / Dept</th>
                  <th>Date</th>
                  <th>Format</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in researchList" :key="item.id">
                  <td>
                    <strong>{{ item.title }}</strong>
                  </td>
                  <td>
                    <span class="text-sm text-primary-700 font-medium">{{ item.college }}</span>
                    <br />
                    <span class="text-xs text-gray-400">({{ item.department }})</span>
                  </td>
                  <td>{{ formatDate(item.created_at) }}</td>
                  <td>
                    <span class="badge bg-blue-100 text-blue-800">
                      {{ getFileExtension(item.file_path) }}
                    </span>
                  </td>
                  <td>
                    <a 
                      :href="`${apiBase}/research/download/${item.id}`" 
                      target="_blank"
                      class="text-primary-600 hover:text-primary-800 font-medium text-sm"
                    >
                      View File →
                    </a>
                  </td>
                </tr>
                <tr v-if="researchList.length === 0">
                  <td colspan="5" class="text-center py-8 text-gray-500">
                    No research found. Be the first to upload!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useResearchStore } from '~/stores/research'
import { useAuthStore } from '~/stores/auth'

const researchStore = useResearchStore()
const authStore = useAuthStore()

const researchList = ref([])
const searchQuery = ref('')
const uploading = ref(false)
const apiBase = useRuntimeConfig().public.apiBase

const form = ref({
  title: '',
  college: '',
  department: ''
})

const selectedFile = ref(null)

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getFileExtension = (path) => {
  if (!path) return 'N/A'
  return path.split('.').pop().toUpperCase()
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const fetchResearch = async (query = '') => {
  await researchStore.fetchResearch(query)
  researchList.value = researchStore.researchList
}

const handleSearch = () => {
  fetchResearch(searchQuery.value)
}

const handleUpload = async () => {
  if (!selectedFile.value) {
    alert('Please select a file to upload.')
    return
  }

  if (!authStore.isAuthenticated) {
    alert('⚠️ Please login to upload research.')
    navigateTo('/auth')
    return
  }

  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('college', form.value.college)
  formData.append('department', form.value.department)
  formData.append('researchFile', selectedFile.value)

  uploading.value = true
  try {
    const res = await researchStore.uploadResearch(formData)
    if (res.success) {
      alert('✅ Research uploaded successfully!')
      form.value = { title: '', college: '', department: '' }
      selectedFile.value = null
      await fetchResearch()
    } else {
      alert('❌ ' + (res.message || 'Upload failed.'))
    }
  } catch (error) {
    alert('❌ Upload error. Please try again.')
    console.error('Upload error:', error)
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  fetchResearch()
})
</script>

<style scoped>
.research-page {
  @apply bg-gray-50 min-h-screen;
}
</style>