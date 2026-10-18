<template>
  <div class="space-y-6 min-h-screen bg-slate-50 dark:bg-[#070b10] text-slate-800 dark:text-slate-100 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-gray-900 dark:text-white">የሜዳ ማረጋገጫ (Approvals)</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">ሁሉንም ሜዳዎች ይመልከቱ እና ያስተዳድሩ</p>
      </div>
      <div class="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
        {{ pendingVenues.length }} በመጠባበቅ ላይ
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 dark:border-[#212e3e] pb-2">
      <button
        @click="activeTab = 'all'"
        class="px-4 py-2 text-sm font-bold rounded-xl transition"
        :class="activeTab === 'all' 
          ? 'bg-emerald-500 text-slate-950' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        📋 ሁሉም ({{ allVenues.length }})
      </button>
      <button
        @click="activeTab = 'approved'"
        class="px-4 py-2 text-sm font-bold rounded-xl transition"
        :class="activeTab === 'approved' 
          ? 'bg-emerald-500 text-slate-950' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        ✅ የተፈቀዱ ({{ approvedVenues.length }})
      </button>
      <button
        @click="activeTab = 'pending'"
        class="px-4 py-2 text-sm font-bold rounded-xl transition"
        :class="activeTab === 'pending' 
          ? 'bg-amber-500 text-white' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        ⏳ በመጠባበቅ ላይ ({{ pendingVenues.length }})
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
      <div class="flex items-center gap-2 text-red-700 dark:text-red-300">
        <Icon name="lucide:alert-circle" class="w-5 h-5" />
        <span class="text-sm font-bold">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      <p class="mt-2 text-sm text-slate-500">በመጫን ላይ...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="currentVenues.length === 0" class="text-center py-16 bg-white dark:bg-[#0b1320] rounded-2xl border border-gray-200 dark:border-slate-800">
      <div class="text-6xl mb-4">✅</div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">ምንም ቬኒዎች የሉም</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">{{ emptyMessage }}</p>
    </div>

    <!-- Venues List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="venue in currentVenues" :key="venue.id" 
        class="rounded-2xl overflow-hidden border-2"
        :class="venue.status === 'approved' || venue.is_active 
          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
          : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'"
      >
        <div class="relative h-40 bg-slate-200 dark:bg-slate-800">
          <img
            v-if="venue.image"
            :src="venue.image" 
            :alt="venue.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon name="lucide:stadium" class="w-12 h-12 text-gray-400" />
          </div>
          
          <!-- Status Badge -->
          <span class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white"
            :class="venue.status === 'approved' || venue.is_active ? 'bg-emerald-500' : 'bg-amber-500'"
          >
            {{ venue.status === 'approved' || venue.is_active ? '✅ Approved' : '⏳ Pending' }}
          </span>
          
          <span class="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/70 text-white">
            {{ venue.city }}
          </span>
        </div>

        <div class="p-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ venue.name }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ venue.location }}</p>
          <p class="text-xs text-slate-400 mt-1">
            ባለቤት: {{ venue.user?.name || 'Unknown' }}
          </p>
          <div class="flex items-center gap-4 mt-3 text-sm">
            <span>👥 {{ venue.capacity }}</span>
            <span class="font-bold"
              :class="venue.status === 'approved' || venue.is_active ? 'text-emerald-500' : 'text-amber-500'"
            >
              {{ venue.price_per_hour }} ETB/hr
            </span>
          </div>
          
          <!-- Admin Actions - Only for pending venues -->
          <div v-if="venue.status === 'pending' || !venue.is_active" class="flex gap-2 mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
            <button
              @click="approveVenue(venue.id)"
              class="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-xl transition"
            >
              ✅ አረጋግጥ
            </button>
            <button
              @click="rejectVenue(venue.id)"
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-sm font-bold rounded-xl transition"
            >
              ❌ ውድቅ አድርግ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'

const authStore = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()

const allVenues = ref([])
const approvedVenues = ref([])
const pendingVenues = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const activeTab = ref('all')

// Admin ካልሆነ ወደ መነሻ ይሂድ
onMounted(async () => {
  if (authStore.user?.role !== 'admin') {
    router.push('/')
    return
  }
  await fetchAllVenues()
})

// ============================================
// FETCH ALL VENUES (Both Approved & Pending)
// ============================================
const fetchAllVenues = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    // Fetch ALL venues (both approved and pending)
    const response = await $fetch(`${config.public.apiBase}/admin/venues`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.success) {
      allVenues.value = response.data?.data || response.data || []
      
      // Separate into approved and pending
      approvedVenues.value = allVenues.value.filter(v => v.status === 'approved' || v.is_active === true)
      pendingVenues.value = allVenues.value.filter(v => v.status === 'pending' || v.is_active === false)
    }
  } catch (error) {
    console.error('Error fetching venues:', error)
    errorMessage.value = 'Failed to fetch venues. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// ============================================
// COMPUTED
// ============================================
const currentVenues = computed(() => {
  if (activeTab.value === 'all') return allVenues.value
  if (activeTab.value === 'approved') return approvedVenues.value
  if (activeTab.value === 'pending') return pendingVenues.value
  return allVenues.value
})

const emptyMessage = computed(() => {
  if (activeTab.value === 'all') return 'ምንም ቬኒዎች አልተገኙም'
  if (activeTab.value === 'approved') return 'ምንም የተፈቀዱ ቬኒዎች የሉም'
  if (activeTab.value === 'pending') return 'ምንም በመጠባበቅ ላይ ያሉ ቬኒዎች የሉም'
  return ''
})

// ============================================
// APPROVE VENUE
// ============================================
const approveVenue = async (id) => {
  errorMessage.value = ''
  if (!confirm('ይህን ሜዳ ማረጋገጥ ይፈልጋሉ?')) return
  
  try {
    const response = await $fetch(`${config.public.apiBase}/admin/approvals/${id}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.success) {
      // Refresh the list
      await fetchAllVenues()
      alert('ሜዳ በሚገባ ተረጋግጧል!')
    }
  } catch (error) {
    console.error('Error approving venue:', error)
    errorMessage.value = 'Failed to approve venue. Please try again.'
  }
}

// ============================================
// REJECT VENUE
// ============================================
const rejectVenue = async (id) => {
  errorMessage.value = ''
  if (!confirm('ይህን ሜዳ ውድቅ ማድረግ ይፈልጋሉ?')) return
  
  try {
    const response = await $fetch(`${config.public.apiBase}/admin/approvals/${id}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.success) {
      await fetchAllVenues()
      alert('ሜዳ ውድቅ ተደርጓል!')
    }
  } catch (error) {
    console.error('Error rejecting venue:', error)
    errorMessage.value = 'Failed to reject venue. Please try again.'
  }
}
</script>