<!-- pages/librarian/dashboard.vue -->
<template>
  <div class="librarian-dashboard">
    <div class="bg-primary-900 text-white py-8">
      <div class="container-custom">
        <h1 class="text-3xl font-bold">🛠️ Librarian Dashboard</h1>
        <p class="text-primary-200">Welcome back, {{ authStore.user?.name }}</p>
      </div>
    </div>

    <div class="container-custom py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card p-6 flex items-center gap-4">
          <div class="bg-blue-50 p-3 rounded-xl">
            <span class="text-3xl">📚</span>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ stats.totalBooks }}</div>
            <div class="text-sm text-gray-500">Total Books</div>
          </div>
        </div>
        <div class="card p-6 flex items-center gap-4">
          <div class="bg-green-50 p-3 rounded-xl">
            <span class="text-3xl">📖</span>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ stats.activeBorrows }}</div>
            <div class="text-sm text-gray-500">Active Borrows</div>
          </div>
        </div>
        <div class="card p-6 flex items-center gap-4">
          <div class="bg-yellow-50 p-3 rounded-xl">
            <span class="text-3xl">⏳</span>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ stats.pendingRequests }}</div>
            <div class="text-sm text-gray-500">Pending Requests</div>
          </div>
        </div>
        <div class="card p-6 flex items-center gap-4">
          <div class="bg-purple-50 p-3 rounded-xl">
            <span class="text-3xl">👥</span>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ stats.totalStudents }}</div>
            <div class="text-sm text-gray-500">Total Students</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <NuxtLink to="/librarian/books" class="card p-4 text-center hover:bg-primary-50 transition-colors">
          <span class="text-2xl block mb-2">📕</span>
          <span class="font-medium">Manage Books</span>
        </NuxtLink>
        <NuxtLink to="/librarian/borrows" class="card p-4 text-center hover:bg-primary-50 transition-colors">
          <span class="text-2xl block mb-2">📋</span>
          <span class="font-medium">Manage Borrows</span>
        </NuxtLink>
        <NuxtLink to="/librarian/users" class="card p-4 text-center hover:bg-primary-50 transition-colors">
          <span class="text-2xl block mb-2">👥</span>
          <span class="font-medium">Manage Users</span>
        </NuxtLink>
        <NuxtLink to="/librarian/reports" class="card p-4 text-center hover:bg-primary-50 transition-colors">
          <span class="text-2xl block mb-2">📊</span>
          <span class="font-medium">View Reports</span>
        </NuxtLink>
      </div>

      <!-- Pending Requests Table -->
      <div class="card p-6">
        <h3 class="text-xl font-bold text-primary-800 mb-4">⏳ Pending Closed Shelf Requests</h3>
        <div class="table-wrapper">
          <table class="table-custom">
            <thead>
              <tr>
                <th>Book</th>
                <th>Student</th>
                <th>Request Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in pendingRequests" :key="request.id">
                <td>{{ request.book_title }}</td>
                <td>{{ request.student_name }}</td>
                <td>{{ formatDate(request.created_at) }}</td>
                <td>
                  <div class="flex gap-2">
                    <button @click="approveRequest(request.id)" class="btn-primary text-sm px-3 py-1 bg-green-600 hover:bg-green-700">
                      Approve
                    </button>
                    <button @click="rejectRequest(request.id)" class="btn-primary text-sm px-3 py-1 bg-red-600 hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="pendingRequests.length === 0">
                <td colspan="4" class="text-center py-8 text-gray-500">
                  No pending requests.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Redirect if not librarian
if (!authStore.isLibrarian) {
  navigateTo('/')
}

const stats = ref({
  totalBooks: 0,
  activeBorrows: 0,
  pendingRequests: 0,
  totalStudents: 0
})

const pendingRequests = ref([])

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchDashboardData = async () => {
  try {
    const { $axios } = useNuxtApp()
    const res = await $axios.get('/librarian/dashboard')
    stats.value = res.data.stats
    pendingRequests.value = res.data.pending_requests
  } catch (error) {
    console.error('Error fetching dashboard:', error)
  }
}

const approveRequest = async (requestId) => {
  try {
    const { $axios } = useNuxtApp()
    await $axios.post(`/librarian/approve-request/${requestId}`)
    alert('✅ Request approved!')
    await fetchDashboardData()
  } catch (error) {
    alert('❌ Failed to approve request.')
    console.error(error)
  }
}

const rejectRequest = async (requestId) => {
  if (!confirm('Are you sure you want to reject this request?')) return
  try {
    const { $axios } = useNuxtApp()
    await $axios.post(`/librarian/reject-request/${requestId}`)
    alert('✅ Request rejected.')
    await fetchDashboardData()
  } catch (error) {
    alert('❌ Failed to reject request.')
    console.error(error)
  }
}

onMounted(() => {
  fetchDashboardData()
})

definePageMeta({
  middleware: 'librarian'
})
</script>