<!-- pages/my-borrows.vue -->
<template>
  <div class="container-custom py-12">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-primary-800">📚 My Borrows</h2>
      <span class="text-sm text-gray-500">Active Borrows: {{ myBorrows.length }}</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      <p class="mt-4 text-gray-500">Loading your borrows...</p>
    </div>

    <!-- No Borrows -->
    <div v-else-if="myBorrows.length === 0" class="card p-12 text-center">
      <div class="text-6xl mb-4">📖</div>
      <h3 class="text-xl font-bold text-gray-800">No Active Borrows</h3>
      <p class="text-gray-500 mt-2">You haven't borrowed any books yet.</p>
      <NuxtLink to="/search" class="btn-primary inline-block mt-4">
        Browse Books
      </NuxtLink>
    </div>

    <!-- Borrows Table -->
    <div v-else class="table-wrapper">
      <table class="table-custom">
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Status</th>
            <th>Barcode</th>
            <th>Shelf</th>
            <th>Sub Shelf</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in myBorrows" :key="borrow.transaction_id">
            <td>
              <strong>{{ borrow.book_title || borrow.title }}</strong>
              <div class="text-xs text-gray-400">Due: {{ formatDate(borrow.due_date) }}</div>
            </td>
            <td>
              <span :class="getStatusClass(borrow.status)">
                {{ borrow.status }}
              </span>
            </td>
            <td>
              <div v-if="borrow.barcode" class="bg-white p-2 rounded inline-block">
                <Barcode :value="borrow.barcode" width="1.0" height="35" fontSize="10" />
              </div>
              <span v-else class="text-gray-400 text-sm">No Barcode</span>
            </td>
            <td class="font-bold text-primary-700">{{ borrow.shelf_number || 'N/A' }}</td>
            <td class="text-gold-600 font-bold">{{ borrow.subject_category || 'N/A' }}</td>
            <td>
              <button 
                v-if="borrow.status === 'ISSUED'"
                @click="handleReturn(borrow.transaction_id)"
                class="btn-primary text-sm px-4 py-1.5 bg-red-600 hover:bg-red-700"
                :disabled="loading"
              >
                RETURN
              </button>
              <span v-else-if="borrow.status === 'RETURN_PENDING'" class="badge-pending">
                ⏳ Pending...
              </span>
              <span v-else class="badge-available">✅ Returned</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useLibraryStore } from '~/stores/library'
import Barcode from 'vue-barcode'

const authStore = useAuthStore()
const libraryStore = useLibraryStore()

const myBorrows = ref([])
const loading = ref(true)

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  const statusMap = {
    'ISSUED': 'badge-borrowed',
    'RETURN_PENDING': 'badge-pending',
    'RETURNED': 'badge-available',
    'APPROVED': 'badge-available',
    'PENDING': 'badge-pending'
  }
  return statusMap[status] || 'badge'
}

const fetchBorrows = async () => {
  loading.value = true
  try {
    if (authStore.user?.id) {
      const res = await libraryStore.getMyBorrows(authStore.user.id)
      myBorrows.value = res.data || []
    }
  } catch (error) {
    console.error('Error fetching borrows:', error)
  } finally {
    loading.value = false
  }
}

const handleReturn = async (transactionId) => {
  if (!confirm('Are you sure you want to return this book?')) return
  
  loading.value = true
  try {
    const res = await libraryStore.requestReturn(transactionId)
    if (res.success) {
      alert('✅ Return request submitted successfully!')
      await fetchBorrows()
    } else {
      alert('❌ ' + (res.message || 'Return request failed.'))
    }
  } catch (error) {
    alert('❌ Server error. Please try again.')
    console.error('Return error:', error)
  } finally {
    loading.value = false
  }
}

// Check if user is authenticated
if (!authStore.isAuthenticated) {
  navigateTo('/auth')
}

onMounted(() => {
  fetchBorrows()
})

definePageMeta({
  middleware: 'auth'
})
</script>