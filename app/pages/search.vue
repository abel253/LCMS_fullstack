<!-- app/pages/search.vue -->
<script setup lang="ts">
const libraryStore = useLibraryStore()

const searchTerm = ref('')
const searchType = ref<'title' | 'author' | 'isbn'>('title')
const loading = ref(false)
const requestingId = ref<number | null>(null)

// ✅ Guest contact info (optional) — ስም እና ስልክ ብቻ
const guestName = ref('')
const guestPhone = ref('')
const showGuestForm = ref(false)
const selectedItemId = ref<number | null>(null)

const toast = ref<{ show: boolean; msg: string; type: 'success' | 'error' }>({
  show: false,
  msg: '',
  type: 'success',
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, msg, type }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

/* ═══════════════════════════════════════════
   ON MOUNT
   ═══════════════════════════════════════════ */
onMounted(async () => {
  loading.value = true
  try {
    await libraryStore.searchBooks('', 'title')
  } catch (error) {
    console.error('Initial load failed:', error)
    showToast('Failed to load books', 'error')
  } finally {
    loading.value = false
  }
})

/* ═══════════════════════════════════════════
   DEBOUNCED SEARCH
   ═══════════════════════════════════════════ */
const debouncedSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    loading.value = true
    try {
      const q = searchTerm.value.trim()
      if (q.length > 1) {
        await libraryStore.searchBooks(q, searchType.value)
      } else if (q.length === 0) {
        await libraryStore.searchBooks('', 'title')
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      loading.value = false
    }
  }, 500)
}

const handleSearch = async () => {
  loading.value = true
  try {
    await libraryStore.searchBooks(searchTerm.value.trim(), searchType.value)
  } catch (error: any) {
    showToast(error.message || 'Search failed', 'error')
  } finally {
    loading.value = false
  }
}

watch(searchType, () => {
  if (searchTerm.value.trim().length > 1) {
    handleSearch()
  }
})

/* ═══════════════════════════════════════════
   REQUEST BOOK — ሳይገባ ይሰራል!
   ═══════════════════════════════════════════ */
const requestBook = (itemId: number) => {
  // ✅ Login አያስፈልግም — በቀጥታ ይላካል
  selectedItemId.value = itemId
  showGuestForm.value = true
}

const submitRequest = async () => {
  if (!selectedItemId.value) return

  requestingId.value = selectedItemId.value
  showGuestForm.value = false

  try {
    const res = await libraryStore.requestBook(selectedItemId.value, {
      name: guestName.value || 'Guest',
      phone: guestPhone.value || null,
    })
    showToast(res.message || 'Book request submitted!', 'success')

    // Reset form
    guestName.value = ''
    guestPhone.value = ''
    selectedItemId.value = null
  } catch (error: any) {
    showToast(error.message || 'Request failed', 'error')
  } finally {
    requestingId.value = null
  }
}

const cancelRequest = () => {
  showGuestForm.value = false
  selectedItemId.value = null
  guestName.value = ''
  guestPhone.value = ''
}

/* ═══════════════════════════════════════════
   RESET
   ═══════════════════════════════════════════ */
const resetSearch = async () => {
  searchTerm.value = ''
  loading.value = true
  try {
    await libraryStore.searchBooks('', 'title')
  } catch (error) {
    console.error('Reset failed:', error)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="search-page min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- ═══════════════════════════════════════
         Hero Section
         ═══════════════════════════════════════ -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          src="~/assets/images/library11.jpg"
          alt="Library Background"
          class="w-full h-full object-cover opacity-20"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-800/90"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10 text-center text-white">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
          Mekdela Amba University Library
        </h1>
        <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
          Search our vast collection of thousands of books and academic resources instantly.
        </p>

        <form @submit.prevent="handleSearch" class="max-w-4xl mx-auto">
          <div class="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
            <select
              v-model="searchType"
              class="px-4 py-3 bg-white/90 text-gray-800 sm:w-48 rounded-xl border-0 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="title">Search by Title</option>
              <option value="author">Search by Author</option>
              <option value="isbn">Search by ISBN</option>
            </select>
            <input
              v-model="searchTerm"
              @input="debouncedSearch"
              type="text"
              placeholder="Type to search automatically..."
              class="px-4 py-3 bg-white/90 text-gray-800 flex-1 rounded-xl border-0 focus:ring-2 focus:ring-blue-400 outline-none text-lg"
            />
            <button
              type="submit"
              class="px-10 py-4 bg-yellow-400 text-blue-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-yellow-300 transition-all disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? 'Searching...' : 'Search Now' }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         Toast Notification
         ═══════════════════════════════════════ -->
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl font-medium text-white',
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600',
        ]"
      >
        {{ toast.type === 'success' ? '✅' : '⚠️' }} {{ toast.msg }}
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════
         Results Section
         ═══════════════════════════════════════ -->
    <section class="container mx-auto px-4 py-16">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h3 class="text-3xl font-bold text-gray-800">Search Results</h3>
          <p class="text-gray-500 mt-1">
            Found
            <span class="font-bold text-blue-600">{{ libraryStore.searchResults.length }}</span>
            items
            <span v-if="libraryStore.availableCount > 0" class="text-sm text-green-600 ml-2">
              ({{ libraryStore.availableCount }} available)
            </span>
          </p>
        </div>
        <button
          @click="resetSearch"
          class="px-6 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors shadow-sm flex items-center gap-2"
        >
          <span>✕</span> Clear Results
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900"></div>
        <p class="mt-4 text-gray-500 font-medium">Searching the database...</p>
      </div>

      <!-- Results Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in libraryStore.searchResults"
          :key="item.item_id"
          class="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
        >
          <!-- Availability badge -->
          <div
            :class="[
              'absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10',
              item.is_available
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white',
            ]"
          >
            {{ item.is_available ? `${item.available_copies} available` : 'Unavailable' }}
          </div>

          <div class="h-40 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
            <img
              src="~/assets/images/library11.jpg"
              alt="Book Cover"
              class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <span
              class="absolute bottom-2 left-3 text-white text-xs font-mono bg-black/50 px-2 py-1 rounded"
            >
              {{ item.call_number || 'N/A' }}
            </span>
          </div>

          <div class="space-y-3">
            <h4 class="text-xl font-bold text-gray-800 line-clamp-2 leading-tight" :title="item.title">
              {{ item.title }}
            </h4>
            <div class="flex items-center text-gray-600 text-sm">
              <span class="font-semibold mr-2">Author:</span>
              <span class="line-clamp-1">{{ item.author }}</span>
            </div>
            <div class="flex items-center text-gray-500 text-xs font-mono bg-gray-50 p-2 rounded-lg">
              <span class="font-semibold mr-2">ISBN:</span>
              <span>{{ item.isbn || 'N/A' }}</span>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100">
            <button
              @click="requestBook(item.item_id)"
              :disabled="requestingId === item.item_id || !item.is_available"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="requestingId === item.item_id">⏳ Requesting...</span>
              <span v-else-if="!item.is_available">❌ Not Available</span>
              <span v-else>📚 Request Book</span>
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="libraryStore.searchResults.length === 0 && !loading"
          class="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300"
        >
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-2xl font-bold text-gray-700 mb-2">No items found</h3>
          <p class="text-gray-500">We couldn't find any books matching your search criteria.</p>
        </div>
      </div>
    </section>
  </div>
      <!-- ═══════════════════════════════════════
         Guest Request Modal
         ═══════════════════════════════════════ -->
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showGuestForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="cancelRequest"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-2">
            📚 Request Book
          </h3>
          <p class="text-gray-500 text-sm mb-6">
            Please provide your details so we can contact you when the book is ready.
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                v-model="guestName"
                type="text"
                placeholder="Enter your name"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                v-model="guestPhone"
                type="tel"
                placeholder="+251912345678"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              @click="cancelRequest"
              class="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              @click="submitRequest"
              :disabled="!!requestingId"
              class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {{ requestingId ? 'Sending...' : 'Submit Request' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
</template>

<style scoped>
@keyframes highlightFade {
  0% {
    background-color: #fef08a;
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  50% {
    background-color: #fef9c3;
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    background-color: #ffffff;
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>