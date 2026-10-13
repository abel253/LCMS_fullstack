<template>
  <div class="p-6 pt-20 min-h-screen bg-slate-950">
    <div class="max-w-6xl mx-auto">
      
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Icon name="lucide:clipboard-check" class="text-emerald-500" />
            የክፍያ ማረጋገጫ (Approvals)
          </h1>
          <p class="text-slate-400 font-medium mt-1">የስታዲየም ቦታ ማስያዣዎችን እዚህ ያረጋግጡ ወይም ይሰርዙ።</p>
        </div>
        
        <button @click="loadBookings" 
          class="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all border border-emerald-500/20 flex items-center gap-2">
          <Icon name="lucide:refresh-cw" :class="{'animate-spin': isLoading}" class="w-5 h-5" />
          <span class="text-sm font-bold">Refresh</span>
        </button>
      </div>

      <!-- Tabs Navigation (አዲስ የተጨመረ) -->
      <div class="flex flex-wrap gap-3 mb-8 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 inline-flex">
        <button 
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2',
            activeTab === tab.id 
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          ]"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
          <span :class="[
            'ml-2 px-2 py-0.5 rounded-md text-[10px]',
            activeTab === tab.id ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-500'
          ]">
            {{ getCount(tab.id) }}
          </span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && bookings.length === 0" class="flex flex-col items-center justify-center py-24">
        <div class="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p class="text-slate-400 mt-6 font-medium animate-pulse">መረጃዎችን በማምጣት ላይ...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBookings.length === 0" 
        class="text-slate-500 py-24 text-center bg-slate-900/30 rounded-[2rem] border-2 border-dashed border-slate-800">
        <Icon name="lucide:search-x" class="w-20 h-20 mx-auto mb-4 text-slate-800" />
        <h3 class="text-xl font-bold text-slate-300">ምንም መረጃ የለም</h3>
        <p class="text-slate-500 mt-1">በዚህ ክፍል ምንም አይነት የተመዘገበ መረጃ አልተገኘም።</p>
      </div>

      <!-- Bookings Grid -->
      <div v-else class="grid gap-6">
        <div v-for="booking in filteredBookings" :key="booking.id" 
             class="group bg-slate-900 border border-slate-800 rounded-[1.5rem] overflow-hidden hover:border-emerald-500/30 transition-all duration-300 shadow-xl shadow-black/20">
          
          <div class="flex flex-col lg:flex-row items-stretch">
            
            <!-- Screenshot -->
            <div class="lg:w-72 w-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <img v-if="booking.payment_screenshot" 
                   :src="formatStorageUrl(booking.payment_screenshot)" 
                   class="w-full h-full object-cover min-h-[200px] group-hover:scale-105 transition-transform duration-500"
                   alt="Receipt" />
              <div v-else class="text-slate-600 flex flex-col items-center p-10 text-center">
                <Icon name="lucide:image-off" class="w-12 h-12 mb-2" />
                <span class="text-xs font-bold uppercase tracking-widest text-slate-500">ምስል የለም</span>
              </div>
              
              <a v-if="booking.payment_screenshot" 
                 :href="formatStorageUrl(booking.payment_screenshot)" 
                 target="_blank"
                 class="absolute inset-0 bg-emerald-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 text-white">
                <Icon name="lucide:maximize" class="w-8 h-8 mb-2" />
                <span class="text-xs font-black tracking-widest">በሰፊው እይ</span>
              </a>
            </div>

            <!-- Details -->
            <div class="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <div class="space-y-1">
                    <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Stadium / Venue</span>
                    <h2 class="text-white font-black text-2xl tracking-tight uppercase leading-tight">
                      {{ booking.venue?.name || 'Standard Court' }}
                    </h2>
                  </div>
                  <div :class="statusStyle(booking.status)" class="px-4 py-1.5 rounded-full font-black uppercase text-[10px] border tracking-widest">
                    {{ booking.status }}
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 mt-6">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-slate-800 rounded-lg text-slate-400"><Icon name="lucide:phone" class="w-4 h-4" /></div>
                    <div><p class="text-[10px] text-slate-500 font-bold uppercase">Customer</p><p class="text-sm font-bold text-slate-200">{{ booking.phone_number }}</p></div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-slate-800 rounded-lg text-slate-400"><Icon name="lucide:calendar" class="w-4 h-4" /></div>
                    <div><p class="text-[10px] text-slate-500 font-bold uppercase">Schedule</p><p class="text-sm font-bold text-slate-200">{{ formatDate(booking.start_time) }}</p></div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-slate-800 rounded-lg text-emerald-500/50"><Icon name="lucide:banknote" class="w-4 h-4" /></div>
                    <div><p class="text-[10px] text-slate-500 font-bold uppercase">Total Price</p><p class="text-sm font-black text-emerald-400">{{ booking.total_price }} ETB</p></div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-slate-800 rounded-lg text-amber-500/50"><Icon name="lucide:hash" class="w-4 h-4" /></div>
                    <div><p class="text-[10px] text-slate-500 font-bold uppercase">Transaction Ref</p><p class="text-sm font-mono font-bold text-amber-500">{{ booking.transaction_ref }}</p></div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-8 flex flex-wrap gap-4 justify-end border-t border-slate-800 pt-6">
                <template v-if="booking.status === 'pending'">
                  <button @click="reject(booking.id)" 
                          class="px-6 py-2.5 bg-slate-800 hover:bg-rose-600/20 hover:text-rose-500 text-slate-400 font-bold rounded-xl transition-all border border-transparent hover:border-rose-500/30">
                    REJECT
                  </button>
                  <button @click="approve(booking.id)" 
                          class="px-10 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                    CONFIRM BOOKING
                  </button>
                </template>
                <div v-else class="text-slate-500 flex items-center gap-2 font-bold italic text-sm">
                  <Icon name="lucide:check-circle-2" class="w-4 h-4 text-slate-600" />
                  ይህ መዝገብ ውሳኔ አግኝቷል።
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const authStore = useAuthStore()
const bookings = ref([])
const isLoading = ref(false)
const activeTab = ref('pending') // Default tab is 'pending'

const tabs = [
  { id: 'all', label: 'ሁሉም', icon: 'lucide:layout-grid' },
  { id: 'pending', label: 'በመጠባበቅ ላይ', icon: 'lucide:clock' },
  { id: 'confirmed', label: 'የተረጋገጡ', icon: 'lucide:check-circle' },
  { id: 'rejected', label: 'የተሰረዙ', icon: 'lucide:x-circle' },
]

// Filter Bookings Based on Active Tab
const filteredBookings = computed(() => {
  if (activeTab.value === 'all') return bookings.value
  return bookings.value.filter(b => b.status === activeTab.value)
})

// Get count for badges
const getCount = (status) => {
  if (status === 'all') return bookings.value.length
  return bookings.value.filter(b => b.status === status).length
}

const statusStyle = (status) => {
  if (status === 'confirmed') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (status === 'pending') return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
}

const formatStorageUrl = (path) => {
  if (!path) return ''
  const baseUrl = config.public.apiBase.replace('/api', '')
  return `${baseUrl}/storage/${path}`
}

const loadBookings = async () => {
  isLoading.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/admin/bookings-list`, {
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    })
    bookings.value = data
  } catch (err) {
    console.error("Fetch error:", err)
  } finally {
    isLoading.value = false
  }
}

const approve = async (id) => {
  if(!confirm('ይህን ክፍያ እርግጠኛ ሆነው ያጸድቃሉ? ለተጠቃሚው ማሳወቂያ ይላካል።')) return
  try {
    const res = await $fetch(`${config.public.apiBase}/admin/bookings/${id}/confirm`, { 
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if(res.success) loadBookings()
  } catch (err) { alert("Process failed.") }
}

const reject = async (id) => {
  if(!confirm('ይህን ጥያቄ ውድቅ ያደርጋሉ?')) return
  try {
    const res = await $fetch(`${config.public.apiBase}/admin/bookings/${id}/reject`, { 
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if(res.success) loadBookings()
  } catch (err) { alert("Action failed.") }
}

const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateStr))
}

onMounted(loadBookings)
</script>