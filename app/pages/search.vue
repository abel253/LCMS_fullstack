<!-- app/pages/search.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// ═══════════════════════════════════════════
// 1. TYPE DEFINITION (ከ Pinia Store እና Database ጋር 100% የሚጣጣም)
// ═══════════════════════════════════════════
interface LibraryItem {
  item_id: number
  title: string
  author?: string
  isbn?: string
  call_number?: string
  total_copies?: number
  available_copies?: number
  is_available?: boolean
  shelf_number?: string
  shelf_type?: string
  sub_shelf_number?: string
  subject_category?: string
  location?: string
  publisher?: string
  publication_year?: number
  edition?: string
  barcode?: string
  [key: string]: any
}

const libraryStore = useLibraryStore()
const route = useRoute()

// Search Inputs & Filters State
const searchTerm = ref('')
const searchType = ref<'title' | 'author' | 'isbn' | 'call_number'>('title')
const loading = ref(false)
const requestingId = ref<number | null>(null)

const selectedCategory = ref('All Stacks')
const filterShelfType = ref<'all' | 'OPEN' | 'CLOSED'>('all')
const onlyAvailable = ref(false)
const sortBy = ref<'title' | 'year' | 'available'>('title')

// Modal States
const showDetailModal = ref(false)
const selectedBook = ref<LibraryItem | null>(null)

// Guest Request Modal State
const guestName = ref('')
const guestPhone = ref('')
const showGuestForm = ref(false)
const selectedItemId = ref<number | null>(null)

// Toast State
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

// ═══════════════════════════════════════════
// 2. INTELLIGENT DATA RESOLVERS (ከ SQL ዳታቤዝህ በቀጥታ የሚያነብ)
// ═══════════════════════════════════════════

// የካታጎሪ መለያ፦ በዳታቤዝህ ውስጥ ያሉትን መጽሐፍት በ Call Number እና Title በትክክል ይመድባል
const resolveCategory = (item: LibraryItem): string => {
  const sc = String(item.subject_category || item.subjectCategory || '').trim()
  const title = (item.title || '').toLowerCase()
  const call = (item.call_number || '').toUpperCase().trim()

  // የጽሑፍ ካታጎሪ ካለው
  if (sc && isNaN(Number(sc))) {
    const sLower = sc.toLowerCase()
    if (sLower.includes('economic') || sLower.includes('management') || sLower.includes('business')) return 'Economics & Business'
    if (sLower.includes('agricultur')) return 'Agriculture & Forestry'
    if (sLower.includes('computer') || sLower.includes('software')) return 'Computer Science & IT'
    if (sLower.includes('environment')) return 'Natural & Environmental Sciences'
    if (sLower.includes('history')) return 'Social Sciences & Humanities'
    if (sLower.includes('engineering')) return 'Engineering & Technology'
    if (sLower.includes('math')) return 'Mathematics & Statistics'
  }

  // በ Call Number (Library of Congress) ምደባ መሰረት
  if (
    call.startsWith('QA76') || 
    title.includes('computer') || 
    title.includes('programming') || 
    title.includes('software') || 
    title.includes('linux') || 
    title.includes('java') || 
    title.includes('python') || 
    title.includes('database') ||
    title.includes('network')
  ) {
    return 'Computer Science & IT'
  }
  
  if (call.startsWith('QA') || call.startsWith('HA') || title.includes('calculus') || title.includes('algebra') || title.includes('statistic')) {
    return 'Mathematics & Statistics'
  }
  
  if (call.startsWith('S') || call.startsWith('SB') || call.startsWith('SD') || call.startsWith('SF') || call.startsWith('SH') || call.startsWith('SK') || title.includes('crop') || title.includes('soil') || title.includes('forest')) {
    return 'Agriculture & Forestry'
  }
  
  if (call.startsWith('H') || call.startsWith('HB') || call.startsWith('HC') || call.startsWith('HD') || call.startsWith('HF') || call.startsWith('HG') || call.startsWith('HJ')) {
    return 'Economics & Business'
  }
  
  if (call.startsWith('Q') || call.startsWith('QC') || call.startsWith('QD') || call.startsWith('QE') || call.startsWith('QH') || call.startsWith('QK') || call.startsWith('QL') || call.startsWith('QR') || call.startsWith('GE')) {
    return 'Natural & Biological Sciences'
  }
  
  if (call.startsWith('R') || call.startsWith('RA') || call.startsWith('RB') || call.startsWith('RC') || call.startsWith('RM') || call.startsWith('RS') || call.startsWith('QP') || call.startsWith('QM') || call.startsWith('QS') || call.startsWith('QT')) {
    return 'Health & Medical Sciences'
  }
  
  if (call.startsWith('T') || call.startsWith('TA') || call.startsWith('TC') || call.startsWith('TD') || call.startsWith('TK') || call.startsWith('TP') || call.startsWith('TN') || call.startsWith('TS')) {
    return 'Engineering & Technology'
  }
  
  if (call.startsWith('P') || call.startsWith('PE') || call.startsWith('PR') || call.startsWith('PS') || call.startsWith('PN') || call.startsWith('L') || call.startsWith('LB') || call.startsWith('B') || call.startsWith('D') || call.startsWith('J') || call.startsWith('K')) {
    return 'Social Sciences & Humanities'
  }

  return 'General Academic'
}

// ክፍት እና ዝግ መደርደሪያ መለያ፦ በዳታቤዝህ ውስጥ 'G+1 close' ወይም 'shelf_type=CLOSED' የሆኑትን ይለያል
const resolveShelfType = (item: LibraryItem): 'OPEN' | 'CLOSED' => {
  const st = String(item.shelf_type || item.shelfType || '').toUpperCase()
  if (st === 'CLOSED') return 'CLOSED'
  
  const loc = String(item.location || '').toLowerCase()
  if (loc.includes('close') || loc.includes('cloth') || loc.includes('stack')) {
    return 'CLOSED'
  }
  return 'OPEN'
}

const getAvailableCount = (item: LibraryItem): number => {
  if (typeof item.available_copies === 'number') return item.available_copies
  if (typeof (item as any).available_quantity === 'number') return (item as any).available_quantity
  return item.is_available ? (item.total_copies ?? 1) : 0
}

const getTotalCount = (item: LibraryItem): number => {
  return item.total_copies ?? (item as any).quantity ?? 1
}

const isBookAvailable = (item: LibraryItem): boolean => {
  if (typeof item.is_available === 'boolean') return item.is_available
  return getAvailableCount(item) > 0
}

// በዳታቤዝህ ላይ ያሉት ዋና ዋና የምድብ ክፍሎች (Categories)
const academicCategories = [
  'All Stacks',
  'Computer Science & IT',
  'Mathematics & Statistics',
  'Agriculture & Forestry',
  'Economics & Business',
  'Natural & Biological Sciences',
  'Health & Medical Sciences',
  'Engineering & Technology',
  'Social Sciences & Humanities',
]

// ═══════════════════════════════════════════
// 3. FILTERED & SORTED HOLDINGS
// ═══════════════════════════════════════════
const filteredHoldings = computed<LibraryItem[]>(() => {
  let list = [...((libraryStore.searchResults as LibraryItem[]) || [])]

  // 1. Search Query Filter
  if (searchTerm.value.trim()) {
    const q = searchTerm.value.toLowerCase().trim()
    list = list.filter((b) => {
      if (searchType.value === 'title') return (b.title || '').toLowerCase().includes(q)
      if (searchType.value === 'author') return (b.author || '').toLowerCase().includes(q)
      if (searchType.value === 'isbn') return (b.isbn || '').toLowerCase().includes(q)
      if (searchType.value === 'call_number') return (b.call_number || '').toLowerCase().includes(q)
      return (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q)
    })
  }

  // 2. Shelf Type Filter (Open Shelf vs Closed Stack)
  if (filterShelfType.value !== 'all') {
    list = list.filter((b) => resolveShelfType(b) === filterShelfType.value)
  }

  // 3. Category Filter
  if (selectedCategory.value !== 'All Stacks') {
    list = list.filter((b) => resolveCategory(b) === selectedCategory.value)
  }

  // 4. Only Available Filter
  if (onlyAvailable.value) {
    list = list.filter((b) => isBookAvailable(b))
  }

  // 5. Sorting Logic
  list.sort((a, b) => {
    if (sortBy.value === 'title') {
      return (a.title || '').localeCompare(b.title || '')
    }
    if (sortBy.value === 'year') {
      const yA = (a as any).publication_year || (a as any).publicationYear || 0
      const yB = (b as any).publication_year || (b as any).publicationYear || 0
      return yB - yA
    }
    if (sortBy.value === 'available') {
      return getAvailableCount(b) - getAvailableCount(a)
    }
    return 0
  })

  return list
})

// ═══════════════════════════════════════════
// 4. SEARCH EXECUTION
// ═══════════════════════════════════════════
const triggerSearch = async () => {
  loading.value = true
  try {
    await libraryStore.searchBooks(searchTerm.value.trim(), searchType.value)
  } catch (error: any) {
    showToast(error.message || 'Search execution failed', 'error')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    triggerSearch()
  }, 450)
}

watch(searchType, () => {
  if (searchTerm.value.trim().length > 0) {
    triggerSearch()
  }
})

// ═══════════════════════════════════════════
// 5. ON MOUNTED
// ═══════════════════════════════════════════
onMounted(async () => {
  loading.value = true
  try {
    if (route.query.q) {
      searchTerm.value = String(route.query.q)
      if (route.query.filter && ['title', 'author', 'isbn', 'call_number'].includes(String(route.query.filter))) {
        searchType.value = route.query.filter as any
      }
      await libraryStore.searchBooks(searchTerm.value.trim(), searchType.value)
    } else {
      await libraryStore.searchBooks('', 'title')
    }
  } catch (error) {
    console.error('Catalog load failed:', error)
    showToast('Failed to load books catalog', 'error')
  } finally {
    loading.value = false
  }
})

// ═══════════════════════════════════════════
// 6. MODALS LOGIC
// ═══════════════════════════════════════════
const openDetails = (book: LibraryItem) => {
  selectedBook.value = {
    ...book,
    resolvedCategory: resolveCategory(book),
    resolvedShelfType: resolveShelfType(book),
    availableCount: getAvailableCount(book),
    totalCount: getTotalCount(book),
    shelf_number: (book as any).shelf_number || 'Section 1',
    sub_shelf_number: (book as any).sub_shelf_number || 'N/A',
    call_number: book.call_number || 'N/A',
    publication_year: (book as any).publication_year || (book as any).publicationYear || 'N/A',
    publisher: (book as any).publisher || 'University Academic Press',
    edition: (book as any).edition && (book as any).edition !== '.' ? (book as any).edition : 'Standard Edition',
    location: (book as any).location || 'Central Library Wing',
    barcode: (book as any).barcode || `MAU-${book.item_id}`,
  }
  showDetailModal.value = true
}

const closeDetails = () => {
  showDetailModal.value = false
  selectedBook.value = null
}

const requestBook = (itemId: number) => {
  selectedItemId.value = itemId
  showGuestForm.value = true
}

const submitRequest = async () => {
  if (!selectedItemId.value) return

  requestingId.value = selectedItemId.value
  showGuestForm.value = false

  try {
    const res = await libraryStore.requestBook(selectedItemId.value, {
      name: guestName.value || 'Student Borrower',
      phone: guestPhone.value || null,
    })
    showToast(res?.message || 'Book request submitted to circulation desk!', 'success')
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

const resetAllFilters = async () => {
  searchTerm.value = ''
  selectedCategory.value = 'All Stacks'
  filterShelfType.value = 'all'
  onlyAvailable.value = false
  sortBy.value = 'title'
  loading.value = true
  try {
    await libraryStore.searchBooks('', 'title')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="search-catalog-page min-h-screen bg-[#f8fafc] text-slate-800">
    
    <!-- ══════════════════════════════════════════════════════
         1. HERO SECTION WITH IMAGE BACKGROUND
         ══════════════════════════════════════════════════════ -->
    <header class="relative overflow-hidden py-14 lg:py-20 shadow-md">
      
      <!-- Clear Hero Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="~/assets/images/library11.jpg" 
          alt="Mekdela Amba University Library" 
          class="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.82] contrast-105"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#004e7c]/85 via-[#0177aa]/75 to-[#01ACF2]/80"></div>
      </div>

      <!-- Hero Content -->
      <div class="container mx-auto px-4 max-w-5xl relative z-10 text-center text-white">
        
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <span>🏛️</span>
          <span>Mekdela Amba University • OPAC Library Catalog</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight mb-3 drop-shadow-md">
          Discover Academic Holdings
        </h1>
        <p class="text-blue-100 text-sm sm:text-base font-normal max-w-2xl mx-auto mb-8 drop-shadow">
          Search over thousands of physical books, reserve archives, and research publications cataloged across all campuses.
        </p>

        <!-- Search Bar with Selector -->
        <form @submit.prevent="triggerSearch" class="max-w-3xl mx-auto">
          <div class="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/80">
            
            <div class="relative w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-slate-200">
              <select 
                v-model="searchType" 
                class="w-full py-2.5 pl-3 pr-8 bg-transparent text-slate-700 text-xs font-bold outline-none cursor-pointer appearance-none"
              >
                <option value="title">📖 Book Title</option>
                <option value="author">✍️ Author Name</option>
                <option value="isbn">🔢 ISBN Number</option>
                <option value="call_number">📍 Call Number</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>

            <input 
              v-model="searchTerm"
              @input="debouncedSearch"
              type="text" 
              placeholder="Type to search automatically across all subjects..." 
              class="w-full py-2.5 px-3 text-sm text-slate-800 placeholder-slate-400 outline-none flex-1 font-medium"
            />

            <button 
              type="submit" 
              class="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#01ACF2] to-[#0089cc] hover:from-[#009adc] hover:to-[#007cb8] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
              :disabled="loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{{ loading ? 'Searching...' : 'Search Catalog' }}</span>
            </button>
          </div>
        </form>

      </div>
    </header>

    <!-- ══════════════════════════════════════════════════════
         2. FACULTY / CATEGORY PILLS & FILTERS STRIP
         ══════════════════════════════════════════════════════ -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div class="container mx-auto px-4 max-w-7xl py-3">
        
        <!-- Category Horizontal Scroll -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Faculty / Subject:
          </span>
          <button 
            v-for="cat in academicCategories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0',
              selectedCategory === cat 
                ? 'bg-[#0072b2] text-white shadow-sm ring-2 ring-sky-200 font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Shelf Type & Availability Controls -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-100 text-xs">
          
          <!-- Shelf Access Filter (Open vs Closed) -->
          <div class="flex items-center gap-2">
            <span class="text-slate-500 font-semibold">Stack Access:</span>
            <div class="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button 
                @click="filterShelfType = 'all'"
                :class="['px-3 py-1 rounded-md text-xs font-bold transition-all', filterShelfType === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500']"
              >
                All Holdings
              </button>
              <button 
                @click="filterShelfType = 'OPEN'"
                :class="['px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5', filterShelfType === 'OPEN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600']"
              >
                <span>🟢</span> Open Shelf (ክፍት መደርደሪያ)
              </button>
              <button 
                @click="filterShelfType = 'CLOSED'"
                :class="['px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5', filterShelfType === 'CLOSED' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600']"
              >
                <span>🔒</span> Closed Stack (ዝግ መደርደሪያ)
              </button>
            </div>
          </div>

          <!-- Availability & Sorting -->
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-600 select-none">
              <input type="checkbox" v-model="onlyAvailable" class="rounded text-[#01ACF2] focus:ring-0" />
              <span>Available Copies Only</span>
            </label>

            <div class="flex items-center gap-1">
              <span class="text-slate-400">Sort:</span>
              <select v-model="sortBy" class="bg-transparent font-bold text-slate-700 outline-none cursor-pointer">
                <option value="title">Title (A-Z)</option>
                <option value="year">Newest Year</option>
                <option value="available">Available Copies</option>
              </select>
            </div>

            <button 
              @click="resetAllFilters" 
              class="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition ml-2"
            >
              <span>✕</span> Reset
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         3. MAIN CATALOG GRID (COMPETITION LEVEL CARD DESIGN)
         ══════════════════════════════════════════════════════ -->
    <main class="container mx-auto px-4 max-w-7xl py-10">
      
      <!-- Summary Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-3">
        <div>
          <h2 class="text-2xl font-serif font-extrabold text-slate-800 tracking-tight">
            Available Library Holdings
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Displaying <strong class="text-slate-800 font-bold">{{ filteredHoldings.length }}</strong> verified books in catalog
            <span v-if="selectedCategory !== 'All Stacks'" class="text-[#01ACF2] font-semibold"> • Subject: {{ selectedCategory }}</span>
            <span v-if="filterShelfType !== 'all'" class="text-amber-600 font-semibold"> • ({{ filterShelfType === 'OPEN' ? 'Open Shelf' : 'Closed Stack' }})</span>
          </p>
        </div>

        <div class="flex items-center gap-3 text-xs font-semibold text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 
            <span>Open Shelf = Self Pickup</span>
          </span>
          <span class="text-slate-300">|</span>
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 
            <span>Closed Stack = Desk Request</span>
          </span>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-28">
        <div class="animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-[#01ACF2]"></div>
        <p class="mt-4 text-xs font-bold text-slate-600 uppercase tracking-widest">Querying Library Database...</p>
      </div>

      <!-- Book Cards Grid -->
      <div v-else-if="filteredHoldings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div 
          v-for="item in filteredHoldings" 
          :key="item.item_id"
          class="catalog-book-card group"
        >
          <!-- Top Card Ribbon -->
          <div class="p-4 pb-0 flex items-center justify-between">
            
            <!-- Open vs Closed Stack Badge -->
            <div 
              v-if="resolveShelfType(item) === 'OPEN'"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Open Shelf (ክፍት መደርደሪያ)</span>
            </div>
            
            <div 
              v-else
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
            >
              <span>🔒</span>
              <span>Closed Stack (ዝግ መደርደሪያ)</span>
            </div>

            <!-- Copies Availability Status -->
            <span 
              :class="[
                'text-[11px] font-bold px-2 py-0.5 rounded-md',
                isBookAvailable(item) ? 'bg-emerald-100/70 text-emerald-800' : 'bg-red-100 text-red-700'
              ]"
            >
              {{ isBookAvailable(item) ? `${getAvailableCount(item)} of ${getTotalCount(item)} Avail.` : 'Checked Out' }}
            </span>
          </div>

          <!-- Book Details Row -->
          <div class="p-4 flex gap-4 flex-1">
            
            <!-- Visual Book Spine -->
            <div class="w-20 h-28 rounded-lg bg-gradient-to-br from-[#01ACF2]/15 via-sky-50 to-indigo-50 border border-sky-100 p-2 flex flex-col justify-between shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden relative">
              <span class="text-[8px] font-bold text-[#0072b2] uppercase tracking-wider truncate">
                {{ resolveCategory(item) }}
              </span>
              <div class="text-[10px] font-serif font-bold text-slate-800 line-clamp-3 leading-tight">
                {{ item.title }}
              </div>
              <span class="text-[8px] font-mono text-slate-600 bg-white/90 px-1 py-0.5 rounded text-center truncate border border-slate-200">
                {{ item.call_number || 'LIB' }}
              </span>
            </div>

            <!-- Content Details -->
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {{ resolveCategory(item) }}
                </span>
                
                <h3 
                  @click="openDetails(item)"
                  class="text-sm font-bold text-slate-800 hover:text-[#01ACF2] cursor-pointer line-clamp-2 leading-snug transition-colors mt-0.5"
                  :title="item.title"
                >
                  {{ item.title }}
                </h3>
                
                <p class="text-xs text-slate-500 mt-1 truncate">
                  Author: <span class="font-medium text-slate-700">{{ item.author || 'MAU Academic Author' }}</span>
                </p>
              </div>

              <!-- Shelf Location from Real DB -->
              <div class="mt-3 pt-2.5 border-t border-slate-100 text-xs">
                
                <!-- IF OPEN SHELF: SHOW EXACT AISLE & SHELF NUMBER -->
                <div v-if="resolveShelfType(item) === 'OPEN'" class="space-y-1">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-slate-400 font-medium">Shelf Row:</span>
                    <span class="font-bold font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      Shelf {{ (item as any).shelf_number || 'A-01' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Call: <strong class="font-mono text-slate-700">{{ item.call_number || 'N/A' }}</strong></span>
                    <span class="text-emerald-600 font-semibold">✓ Self Pickup ({{ (item as any).location || 'Ground' }})</span>
                  </div>
                </div>

                <!-- IF CLOSED SHELF: RESTRICTED ACCESS & DESK REQUEST -->
                <div v-else class="space-y-1">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-slate-400 font-medium">Shelf Access:</span>
                    <span class="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                      Restricted Archive ({{ (item as any).location || 'G+1 close' }})
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Hold ID: <strong class="font-mono text-slate-700">#{{ item.item_id }}</strong></span>
                    <span class="text-amber-600 font-semibold">⚠ Request Librarian to Retrieve</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="p-3 bg-slate-50/90 border-t border-slate-100 rounded-b-2xl grid grid-cols-2 gap-2">
            <button 
              @click="openDetails(item)"
              class="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>🔍</span>
              <span>View Details</span>
            </button>

            <button 
              @click="requestBook(item.item_id)"
              :disabled="requestingId === item.item_id || !isBookAvailable(item)"
              :class="[
                'w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed',
                resolveShelfType(item) === 'CLOSED'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#01ACF2] hover:bg-[#0092d0] text-white'
              ]"
            >
              <span v-if="requestingId === item.item_id">Sending...</span>
              <span v-else-if="!isBookAvailable(item)">Loaned Out</span>
              <span v-else-if="resolveShelfType(item) === 'CLOSED'">Request Librarian</span>
              <span v-else>Borrow Book</span>
            </button>
          </div>

        </div>

      </div>

      <!-- No Books State -->
      <div 
        v-else 
        class="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 p-8 max-w-md mx-auto shadow-sm"
      >
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-lg font-bold text-slate-800">No matching books found</h3>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          No records match your selected keyword or active category in the library catalog.
        </p>
        <button 
          @click="resetAllFilters" 
          class="mt-5 px-6 py-2.5 bg-[#01ACF2] text-white rounded-xl text-xs font-bold hover:bg-[#008fcc] transition shadow-md"
        >
          Reset All Filters
        </button>
      </div>

    </main>

    <!-- ══════════════════════════════════════════════════════
         4. COMPREHENSIVE VIEW DETAILS MODAL
         ══════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div 
        v-if="showDetailModal && selectedBook"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
        @click.self="closeDetails"
      >
        <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-scale-up">
          
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-slate-50 to-sky-50/50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-[#0072b2] uppercase tracking-wider">
                {{ selectedBook.resolvedCategory }}
              </span>
              <span class="text-slate-300">|</span>
              <span 
                v-if="selectedBook.resolvedShelfType === 'CLOSED'"
                class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800"
              >
                🔒 Closed Stack
              </span>
              <span 
                v-else
                class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800"
              >
                🟢 Open Shelf
              </span>
            </div>

            <button @click="closeDetails" class="text-slate-400 hover:text-slate-700 text-base font-bold p-1">
              ✕
            </button>
          </div>

          <!-- Modal Body Content -->
          <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            <!-- Book Top Header Info -->
            <div class="flex flex-col sm:flex-row gap-5 items-start">
              <div class="w-24 h-32 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl border border-sky-200 flex flex-col items-center justify-center p-2 text-3xl shrink-0 shadow-xs">
                <span>📖</span>
                <span class="text-[9px] font-mono text-slate-500 mt-2">{{ selectedBook.barcode }}</span>
              </div>
              <div class="flex-1">
                <h2 class="text-lg sm:text-xl font-serif font-bold text-slate-800 leading-snug">
                  {{ selectedBook.title }}
                </h2>
                <p class="text-xs text-slate-600 mt-1">
                  Author: <strong class="text-slate-800">{{ selectedBook.author || 'Unknown' }}</strong>
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Publisher: {{ selectedBook.publisher }} • Year: {{ selectedBook.publication_year }} • Edition: {{ selectedBook.edition }}
                </p>

                <!-- Status Badges -->
                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <span 
                    :class="[
                      'text-xs font-bold px-2.5 py-1 rounded-md',
                      (selectedBook.available_copies ?? 1) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                    ]"
                  >
                    {{ (selectedBook.available_copies ?? 1) > 0 ? `✓ ${selectedBook.available_copies ?? 1} of ${selectedBook.total_copies ?? 1} Copies Available` : 'Currently Checked Out' }}
                  </span>
                  <span class="text-xs text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">
                    ISBN: {{ selectedBook.isbn || 'N/A' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- SHELF ACCESS RULES (OPEN vs CLOSED) -->
            <div 
              class="rounded-xl p-4 border" 
              :class="selectedBook.resolvedShelfType === 'CLOSED' ? 'bg-amber-50/80 border-amber-200' : 'bg-emerald-50/80 border-emerald-200'"
            >
              <!-- OPEN SHELF DETAILS -->
              <div v-if="selectedBook.resolvedShelfType === 'OPEN'">
                <div class="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                  <span>🟢 OPEN SHELF LOCATION (ክፍት መደርደሪያ)</span>
                </div>
                <p class="text-xs text-slate-600 mb-3">
                  ይህ መጽሐፍ በክፍት መደርደሪያ ላይ የሚገኝ ስለሆነ ተማሪዎች በቀጥታ ሄደው ከመደርደሪያው ላይ ማንሳት ይችላሉ።
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-emerald-100 text-xs">
                  <div>
                    <span class="text-[10px] text-slate-400 block font-medium">Shelf Number:</span>
                    <strong class="text-slate-800 font-mono">Shelf {{ selectedBook.shelf_number }}</strong>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block font-medium">Sub-Shelf:</span>
                    <strong class="text-slate-800 font-mono">{{ selectedBook.sub_shelf_number }}</strong>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block font-medium">Call Number:</span>
                    <strong class="text-slate-800 font-mono">{{ selectedBook.call_number }}</strong>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block font-medium">Building Location:</span>
                    <strong class="text-slate-800">{{ selectedBook.location }}</strong>
                  </div>
                </div>
              </div>

              <!-- CLOSED SHELF DETAILS -->
              <div v-else>
                <div class="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                  <span>🔒 CLOSED STACK ARCHIVE (ዝግ መደርደሪያ)</span>
                </div>
                <p class="text-xs text-slate-700 mb-2 leading-relaxed">
                  <strong>ማሳሰቢያ፦</strong> ይህ መጽሐፍ በዝግ ማህደር (Closed Stack) ውስጥ የሚገኝ ስለሆነ ተማሪዎች በቀጥታ ገብተው መውሰድ አይችሉም።
                </p>
                <div class="bg-white p-3 rounded-lg border border-amber-200 text-xs text-slate-600 space-y-1">
                  <p>• የመጽሐፉን ውስጣዊ መደርደሪያ የሚያውቁት የቤተ-መጽሐፍቱ ሠራተኞች (Librarians) ብቻ ናቸው።</p>
                  <p>• መጽሐፉን ለመዋስ ከታች ያለውን <strong>"Request from Librarian"</strong> በመጫን መጠየቅ ይችላሉ።</p>
                </div>
              </div>
            </div>

            <!-- Technical Specifications Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span class="text-slate-400 block text-[10px]">Item Type</span>
                <span class="font-bold text-slate-700">{{ (selectedBook as any).item_type || 'Book' }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Barcode</span>
                <span class="font-bold font-mono text-slate-700">{{ selectedBook.barcode }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Circulation Policy</span>
                <span class="font-bold text-slate-700">14 Days Loan</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Status</span>
                <span class="font-bold text-emerald-700">{{ (selectedBook as any).status || 'AVAILABLE' }}</span>
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button 
              @click="closeDetails"
              class="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
            >
              Close
            </button>
            
            <button 
              @click="requestBook(selectedBook.item_id); closeDetails()"
              :disabled="!isBookAvailable(selectedBook)"
              class="px-6 py-2.5 bg-[#01ACF2] hover:bg-[#008fcc] text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50"
            >
              {{ selectedBook.resolvedShelfType === 'CLOSED' ? 'Request from Librarian' : 'Request to Borrow' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════════════
         5. GUEST REQUEST MODAL
         ══════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div
        v-if="showGuestForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        @click.self="cancelRequest"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-scale-up">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full bg-sky-50 text-[#01ACF2] flex items-center justify-center text-lg">
              📋
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800">
                Submit Book Request
              </h3>
              <p class="text-xs text-slate-500">Circulation staff will prepare this item for pickup.</p>
            </div>
          </div>

          <div class="space-y-3.5 my-5">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Student / Borrower Full Name
              </label>
              <input
                v-model="guestName"
                type="text"
                placeholder="e.g. Abebe Kebede"
                class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#01ACF2] outline-none transition font-medium"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Active Phone Number (SMS Alert)
              </label>
              <input
                v-model="guestPhone"
                type="tel"
                placeholder="+251 9..."
                class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#01ACF2] outline-none transition font-medium"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="cancelRequest"
              class="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              @click="submitRequest"
              :disabled="!!requestingId"
              class="flex-1 py-2.5 bg-[#01ACF2] text-white rounded-xl text-xs font-bold hover:bg-[#008fcc] disabled:bg-sky-300 transition shadow"
            >
              {{ requestingId ? 'Submitting...' : 'Confirm Request' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════════════
         TOAST NOTIFICATION
         ══════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl font-medium text-xs text-white flex items-center gap-2',
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600',
        ]"
      >
        <span>{{ toast.type === 'success' ? '✓' : '⚠' }}</span>
        <span>{{ toast.msg }}</span>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.catalog-book-card {
  background-color: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.catalog-book-card:hover {
  transform: translateY(-4px);
  border-color: #01acf2;
  box-shadow: 0 12px 28px rgba(1, 172, 242, 0.08);
}

/* Hide scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  0% { transform: scale(0.96); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-scale-up {
  animation: scaleUp 0.22s ease-out forwards;
}
</style>