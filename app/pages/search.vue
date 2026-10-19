<!-- app/pages/search.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'

// ═══════════════════════════════════════════
// 1. TYPES (በዳታቤዝ ስትራክቸር መሰረት)
// ═══════════════════════════════════════════
interface LibraryItem {
  item_id: number
  title: string
  author?: string
  isbn?: string
  call_number?: string
  publisher?: string
  publication_year?: number | string
  edition?: string
  shelf_number?: string
  sub_shelf_number?: string
  subject_category?: string
  location?: string
  effective_location?: string
  barcode?: string
  quantity?: number
  total_copies?: number
  available_quantity?: number
  available_copies?: number
  item_type?: string
  status?: string
  shelf_type?: 'OPEN' | 'CLOSED'
  effective_shelf_type?: 'OPEN' | 'CLOSED'
  pages?: number | string
  language?: string
  synopsis?: string
  [key: string]: any
}

const libraryStore = useLibraryStore()
const route = useRoute()

// ═══════════════════════════════════════════
// 2. STATE
// ═══════════════════════════════════════════
const searchTerm = ref('')
const searchType = ref<'title' | 'author' | 'isbn' | 'call_number'>('title')
const loading = ref(false)
const requestingId = ref<number | null>(null)

const selectedCategory = ref('All Stacks')
const filterShelfType = ref<'all' | 'OPEN' | 'CLOSED'>('all')
const onlyAvailable = ref(false)
const sortBy = ref<'title' | 'year' | 'available'>('title')

const showDetailModal = ref(false)
const selectedBook = ref<LibraryItem | null>(null)

// Retrieval Form (Closed Stack only)
const guestName = ref('')
const guestPhone = ref('')
const showGuestForm = ref(false)
const selectedItemId = ref<number | null>(null)
const selectedItemTitle = ref('')

const toast = ref<{ show: boolean; msg: string; type: 'success' | 'error' }>({
  show: false,
  msg: '',
  type: 'success',
})

const searchInputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, msg, type }
  setTimeout(() => { toast.value.show = false }, 4000)
}

const fallbackHeroImage = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80'
const onHeroImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target && target.src !== fallbackHeroImage) {
    target.src = fallbackHeroImage
  }
}

// ═══════════════════════════════════════════
// 3. ENRICHED CATALOG
// ═══════════════════════════════════════════
const enrichedCatalog = computed<LibraryItem[]>(() => {
  const rawList = [...((libraryStore.searchResults as LibraryItem[]) || [])]

  return rawList.map((item) => ({
    ...item,
    effective_location: String(item.location ?? '').trim() || 'Ground Circulation',
    effective_shelf_type: String(item.shelf_type ?? 'OPEN').toUpperCase() as 'OPEN' | 'CLOSED',
  }))
})

// ═══════════════════════════════════════════
// 4. COMPLETE SHELF TYPE RESOLVER (100% shelf_type)
// ═══════════════════════════════════════════
const resolveShelfType = (item: LibraryItem): 'OPEN' | 'CLOSED' => {
  const storedType = String(item.shelf_type ?? item.effective_shelf_type ?? '').trim().toUpperCase()

  if (storedType === 'CLOSED') return 'CLOSED'
  if (storedType === 'OPEN') return 'OPEN'

  return 'OPEN'
}

// ═══════════════════════════════════════════
// 5. DISPLAY HELPERS
// ═══════════════════════════════════════════
const formatDisplayLocation = (item: LibraryItem): string => {
  if (resolveShelfType(item) === 'CLOSED') {
    return 'Restricted Archive (Closed Stack)'
  }
  const loc = String(item.effective_location || item.location || '').trim()
  const clean = loc.replace(/["'\\`]/g, '').trim()
  if (!clean) return 'Ground Circulation'

  const lower = clean.toLowerCase()
  if (lower.includes('circ') || lower === 'g,circulation' || lower === 'g.circulation') {
    return 'Ground Circulation'
  }
  if (lower.includes('g+1 open') || lower === 'g+1 open') {
    return '1st Floor (G+1 Open)'
  }
  if (lower.includes('g+2') || lower.includes('g +2')) {
    return '2nd Floor (G+2 Open)'
  }
  if (lower.includes('ground open') || lower === 'g.open') {
    return 'Ground Floor Open'
  }
  return clean
}

const resolveCategory = (item: LibraryItem): string => {
  const sc = String(item.subject_category || '').trim()
  const title = (item.title || '').toLowerCase()
  const call = String(item.call_number || '').toUpperCase().trim()

  if (sc && isNaN(Number(sc))) {
    const sLower = sc.toLowerCase()
    if (sLower.includes('computer') || sLower.includes('software') || sLower.includes('information tech')) return 'Computer Science & IT'
    if (sLower.includes('engineering') || sLower.includes('technology')) return 'Engineering & Technology'
    if (sLower.includes('health') || sLower.includes('medical') || sLower.includes('nursing') || sLower.includes('pharm')) return 'Health & Medical Sciences'
    if (sLower.includes('economic') || sLower.includes('management') || sLower.includes('business') || sLower.includes('account')) return 'Business & Economics'
    if (sLower.includes('social') || sLower.includes('history') || sLower.includes('law') || sLower.includes('political') || sLower.includes('psychology') || sLower.includes('philosophy') || sLower.includes('education')) return 'Social Sciences & Humanities'
    if (sLower.includes('agricultur') || sLower.includes('forest') || sLower.includes('animal')) return 'Agriculture & Forestry'
    if (sLower.includes('natural') || sLower.includes('environment') || sLower.includes('biology') || sLower.includes('chemistry') || sLower.includes('physics')) return 'Natural & Environmental Sciences'
    if (sLower.includes('math') || sLower.includes('statistic')) return 'Mathematics & Statistics'
    if (sLower.includes('reference') || sLower.includes('general')) return 'General Reference'
  }

  if (call.startsWith('QA76') || title.includes('computer') || title.includes('programming') || title.includes('software') || title.includes('linux') || title.includes('java') || title.includes('python') || title.includes('database') || title.includes('network')) return 'Computer Science & IT'
  if (call.startsWith('Q') || title.includes('biology') || title.includes('chemistry') || title.includes('physics') || title.includes('ecology') || title.includes('botany') || title.includes('zoology')) return 'Natural & Environmental Sciences'
  if (call.startsWith('T') || call.startsWith('TA') || call.startsWith('TC') || call.startsWith('TD') || call.startsWith('TK') || call.startsWith('TP') || call.startsWith('TN') || call.startsWith('TS')) return 'Engineering & Technology'
  if (call.startsWith('R') || call.startsWith('RA') || call.startsWith('RB') || call.startsWith('RC') || call.startsWith('RM') || call.startsWith('RS') || call.startsWith('QP') || call.startsWith('QM') || call.startsWith('QS') || call.startsWith('QT') || call.startsWith('QV')) return 'Health & Medical Sciences'
  if (call.startsWith('S') || call.startsWith('SB') || call.startsWith('SD') || call.startsWith('SF') || call.startsWith('SH') || call.startsWith('SK') || title.includes('crop') || title.includes('soil') || title.includes('forest')) return 'Agriculture & Forestry'
  if (call.startsWith('H') || call.startsWith('HB') || call.startsWith('HC') || call.startsWith('HD') || call.startsWith('HF') || call.startsWith('HG') || call.startsWith('HJ')) return 'Business & Economics'
  if (call.startsWith('QA') || call.startsWith('HA') || title.includes('calculus') || title.includes('algebra') || title.includes('statistic')) return 'Mathematics & Statistics'
  if (call.startsWith('P') || call.startsWith('PE') || call.startsWith('PR') || call.startsWith('PS') || call.startsWith('PN') || call.startsWith('L') || call.startsWith('LB') || call.startsWith('B') || call.startsWith('D') || call.startsWith('J') || call.startsWith('K')) return 'Social Sciences & Humanities'

  return 'General Reference'
}

const getAvailableCount = (item: LibraryItem): number => {
  if (item.status === 'BORROWED' && (item.total_copies ?? item.quantity ?? 1) <= 1) return 0
  if (item.status === 'LOST') return 0
  if (typeof item.available_copies === 'number') return item.available_copies
  if (typeof item.available_quantity === 'number') return item.available_quantity
  return item.status === 'AVAILABLE' ? (item.total_copies ?? item.quantity ?? 1) : 0
}

const getTotalCount = (item: LibraryItem): number => item.total_copies ?? item.quantity ?? 1
const isBookAvailable = (item: LibraryItem): boolean => getAvailableCount(item) > 0

const academicCategories = [
  'All Stacks',
  'Computer Science & IT',
  'Mathematics & Statistics',
  'Natural & Environmental Sciences',
  'Engineering & Technology',
  'Health & Medical Sciences',
  'Business & Economics',
  'Agriculture & Forestry',
  'Social Sciences & Humanities',
  'General Reference',
]

// ═══════════════════════════════════════════
// 6. COMPUTED LIST & STATS
// ═══════════════════════════════════════════
const filteredHoldings = computed<LibraryItem[]>(() => {
  let list = [...enrichedCatalog.value]

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

  if (filterShelfType.value !== 'all') {
    list = list.filter((b) => resolveShelfType(b) === filterShelfType.value)
  }

  if (selectedCategory.value !== 'All Stacks') {
    list = list.filter((b) => resolveCategory(b) === selectedCategory.value)
  }

  if (onlyAvailable.value) {
    list = list.filter((b) => isBookAvailable(b))
  }

  list.sort((a, b) => {
    if (sortBy.value === 'title') return (a.title || '').localeCompare(b.title || '')
    if (sortBy.value === 'year') {
      const yA = Number(a.publication_year) || 0
      const yB = Number(b.publication_year) || 0
      return yB - yA
    }
    if (sortBy.value === 'available') return getAvailableCount(b) - getAvailableCount(a)
    return 0
  })

  return list
})

const stats = computed(() => {
  const all = enrichedCatalog.value
  let open = 0
  let closed = 0
  let available = 0
  for (const b of all) {
    if (resolveShelfType(b) === 'OPEN') open++
    else closed++
    if (isBookAvailable(b)) available++
  }
  return { total: all.length, open, closed, available }
})

// ═══════════════════════════════════════════
// 7. SEARCH & ACTIONS
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
  debounceTimer = setTimeout(() => { triggerSearch() }, 450)
}

watch(searchType, () => {
  if (searchTerm.value.trim().length > 0) triggerSearch()
})

const handleKeyboard = (e: KeyboardEvent) => {
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
  if (e.key === 'Escape') {
    if (showDetailModal.value) closeDetails()
    if (showGuestForm.value) cancelRequest()
  }
}

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
  window.addEventListener('keydown', handleKeyboard)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboard)
})

// ═══════════════════════════════════════════
// 8. DETAILS MODAL
// ═══════════════════════════════════════════
const openDetails = (book: LibraryItem) => {
  const st = resolveShelfType(book)
  const displayLocation = st === 'CLOSED'
    ? 'Restricted Archive (Access via Librarian only)'
    : formatDisplayLocation(book)

  const displayShelf = st === 'CLOSED' ? '•••' : (book.shelf_number || 'A-01')
  const displaySubShelf = st === 'CLOSED' ? '•••' : (book.sub_shelf_number || 'N/A')

  selectedBook.value = {
    ...book,
    resolvedCategory: resolveCategory(book),
    resolvedShelfType: st,
    availableCount: getAvailableCount(book),
    totalCount: getTotalCount(book),
    shelf_number: displayShelf,
    sub_shelf_number: displaySubShelf,
    call_number: book.call_number || 'N/A',
    publication_year: book.publication_year || 'N/A',
    publisher: book.publisher || 'University Academic Press',
    edition: book.edition && book.edition !== '.' ? book.edition : 'Standard Edition',
    location: displayLocation,
    barcode: book.barcode || `MAU-${book.item_id}`,
    pages: book.pages || '—',
    language: book.language || 'English',
    synopsis: book.synopsis || 'Comprehensive academic textbook referenced in the departmental curriculum.',
  }
  showDetailModal.value = true
}

const closeDetails = () => {
  showDetailModal.value = false
  selectedBook.value = null
}

// ═══════════════════════════════════════════
// 9. REQUEST BOOK (CLOSED ONLY)
// ═══════════════════════════════════════════
const requestBook = (item: LibraryItem) => {
  if (resolveShelfType(item) !== 'CLOSED') {
    showToast('Open shelf books do not require a request. You may pick them directly!', 'success')
    return
  }
  selectedItemId.value = item.item_id
  selectedItemTitle.value = item.title
  showGuestForm.value = true
}

const submitRequest = async () => {
  if (!selectedItemId.value) return
  requestingId.value = selectedItemId.value
  showGuestForm.value = false
  try {
    const res = await libraryStore.requestBook(selectedItemId.value, {
      name: guestName.value.trim() || 'Student Borrower',
      phone: guestPhone.value.trim() || null,
    })
    showToast(res?.message || 'Request submitted! Library staff will retrieve your book.', 'success')
    guestName.value = ''
    guestPhone.value = ''
    selectedItemId.value = null
    selectedItemTitle.value = ''
  } catch (error: any) {
    showToast(error.message || 'Request submission failed', 'error')
  } finally {
    requestingId.value = null
  }
}

const cancelRequest = () => {
  showGuestForm.value = false
  selectedItemId.value = null
  selectedItemTitle.value = ''
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

const copyToClipboard = async (text: string) => {
  if (!text || text === 'N/A') return
  try {
    await navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!', 'success')
  } catch {
    showToast('Copy failed', 'error')
  }
}
</script>

<template>
  <div class="search-catalog-page min-h-screen bg-slate-50 text-slate-800">

    <!-- ══════════════════════════════════════════════════════
         ATTRACTIVE HERO SECTION WITH BACKGROUND IMAGE
         ══════════════════════════════════════════════════════ -->
    <header class="relative overflow-hidden py-14 sm:py-20 shadow-xl bg-slate-900">
      <div class="absolute inset-0 z-0">
        <img
          src="assets/images/library11.jpg"
          @error="onHeroImageError"
          alt="Mekdela Amba University Library"
          class="w-full h-full object-cover object-center filter brightness-[0.55] contrast-110"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#003452]/90 via-[#016592]/80 to-[#001e30]/95"></div>
        <div class="absolute -top-24 -left-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div class="container mx-auto px-4 max-w-5xl relative z-10 text-center text-white">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <span>🏛️</span>
          <span>Mekdela Amba University • OPAC Library Catalog</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight mb-3 drop-shadow-md text-white">
          Discover Academic Holdings
        </h1>
        <p class="text-sky-100 text-sm sm:text-base font-normal max-w-2xl mx-auto mb-8 drop-shadow">
          Search physical books, open circulation stacks, and restricted archives.
          <span class="text-amber-200 font-semibold block sm:inline sm:ml-1">Press <kbd class="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">/</kbd> to focus search</span>
        </p>

        <!-- Search input box -->
        <form @submit.prevent="triggerSearch" class="max-w-3xl mx-auto">
          <div class="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/80">
            <div class="relative w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-slate-200">
              <select v-model="searchType" class="w-full py-2.5 pl-3 pr-8 bg-transparent text-slate-700 text-xs font-bold outline-none cursor-pointer appearance-none">
                <option value="title">📖 Book Title</option>
                <option value="author">✍️ Author</option>
                <option value="isbn">🔢 ISBN</option>
                <option value="call_number">📍 Call Number</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>

            <input
              ref="searchInputRef"
              v-model="searchTerm"
              @input="debouncedSearch"
              type="text"
              placeholder="Search across title, author, call numbers..."
              class="w-full py-2.5 px-3 text-sm text-slate-800 placeholder-slate-400 outline-none flex-1 font-medium bg-transparent"
            />

            <button
              type="submit"
              class="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#01ACF2] to-[#0089cc] hover:from-[#009adc] hover:to-[#007cb8] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 cursor-pointer"
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
         STATS BAR
         ══════════════════════════════════════════════════════ -->
    <div class="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-white rounded-2xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-50 text-[#01ACF2] flex items-center justify-center text-xl">📚</div>
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Volumes</div>
              <div class="text-xl font-extrabold text-slate-800">{{ stats.total }}</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">🟢</div>
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Open Shelf</div>
              <div class="text-xl font-extrabold text-emerald-700">{{ stats.open }}</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">🔒</div>
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Closed Stack</div>
              <div class="text-xl font-extrabold text-amber-700">{{ stats.closed }}</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">✓</div>
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available</div>
              <div class="text-xl font-extrabold text-sky-700">{{ stats.available }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         FILTERS
         ══════════════════════════════════════════════════════ -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs mt-8">
      <div class="container mx-auto px-4 max-w-7xl py-3">
        <!-- Categories horizontal bar -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Discipline:</span>
          <button
            v-for="cat in academicCategories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer',
              selectedCategory === cat
                ? 'bg-[#0072b2] text-white shadow-sm ring-2 ring-sky-200 font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]"
          >{{ cat }}</button>
        </div>

        <!-- Shelf and Sorting bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-100 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-slate-500 font-semibold">Access Level:</span>
            <div class="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button @click="filterShelfType = 'all'"
                :class="['px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer', filterShelfType === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500']"
              >All</button>
              <button @click="filterShelfType = 'OPEN'"
                :class="['px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer', filterShelfType === 'OPEN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600']"
              ><span>🟢</span> Open Shelf</button>
              <button @click="filterShelfType = 'CLOSED'"
                :class="['px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer', filterShelfType === 'CLOSED' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600']"
              ><span>🔒</span> Closed Stack</button>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <label class="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-600 select-none">
              <input type="checkbox" v-model="onlyAvailable" class="rounded text-[#01ACF2] focus:ring-0" />
              <span>Available Only</span>
            </label>
            <div class="flex items-center gap-1">
              <span class="text-slate-400">Sort:</span>
              <select v-model="sortBy" class="bg-transparent font-bold text-slate-700 outline-none cursor-pointer">
                <option value="title">Title (A-Z)</option>
                <option value="year">Publication Year</option>
                <option value="available">Availability</option>
              </select>
            </div>
            <button @click="resetAllFilters" class="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition ml-2 cursor-pointer">
              <span>✕</span> Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         MAIN BOOK GRID
         ══════════════════════════════════════════════════════ -->
    <main class="container mx-auto px-4 max-w-7xl py-10">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-3">
        <div>
          <h2 class="text-2xl font-serif font-extrabold text-slate-800 tracking-tight">Catalogue Holdings</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Displaying <strong class="text-slate-800 font-bold">{{ filteredHoldings.length }}</strong> volumes
            <span v-if="selectedCategory !== 'All Stacks'" class="text-[#01ACF2] font-semibold"> • {{ selectedCategory }}</span>
            <span v-if="filterShelfType !== 'all'" class="text-amber-600 font-semibold"> • ({{ filterShelfType === 'OPEN' ? 'Open Shelf' : 'Closed Stack' }})</span>
          </p>
        </div>
        <div class="flex items-center gap-3 text-xs font-semibold text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Open = Walk to Shelf</span>
          <span class="text-slate-300">|</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Closed = Request from Staff</span>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
          <div class="h-4 w-24 bg-slate-100 rounded mb-3"></div>
          <div class="flex gap-4">
            <div class="w-20 h-28 bg-slate-100 rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 w-full bg-slate-100 rounded"></div>
              <div class="h-3 w-2/3 bg-slate-100 rounded"></div>
              <div class="h-3 w-1/2 bg-slate-100 rounded"></div>
            </div>
          </div>
          <div class="mt-4 h-8 w-full bg-slate-100 rounded-lg"></div>
        </div>
      </div>

      <!-- Book Cards Grid -->
      <div v-else-if="filteredHoldings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filteredHoldings"
          :key="item.item_id"
          class="catalog-book-card group"
        >
          <!-- Top badge -->
          <div class="p-4 pb-0 flex items-center justify-between">
            <div v-if="resolveShelfType(item) === 'OPEN'"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Open Shelf</span>
            </div>
            <div v-else
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span>🔒</span>
              <span>Closed Stack</span>
            </div>

            <span :class="[
              'text-[11px] font-bold px-2 py-0.5 rounded-md',
              isBookAvailable(item) ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
            ]">
              {{ isBookAvailable(item) ? `${getAvailableCount(item)} of ${getTotalCount(item)} available` : 'Loaned Out' }}
            </span>
          </div>

          <!-- Body Card Content -->
          <div class="p-4 flex gap-4 flex-1">
            <div class="w-20 h-28 rounded-lg bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 p-2 flex flex-col justify-between shrink-0 shadow-xs group-hover:scale-105 transition-transform overflow-hidden relative">
              <span class="text-[8px] font-bold text-[#0072b2] uppercase tracking-wider truncate">
                {{ resolveCategory(item).split(' ')[0] }}
              </span>
              <div class="text-[10px] font-serif font-bold text-slate-800 line-clamp-3 leading-tight">{{ item.title }}</div>
              <span class="text-[8px] font-mono text-slate-600 bg-white/90 px-1 py-0.5 rounded text-center truncate border border-slate-200">
                {{ item.call_number || 'LIB' }}
              </span>
            </div>

            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ resolveCategory(item) }}</span>
                <h3 @click="openDetails(item)"
                  class="text-sm font-bold text-slate-800 hover:text-[#01ACF2] cursor-pointer line-clamp-2 leading-snug transition-colors mt-0.5"
                  :title="item.title">{{ item.title }}</h3>
                <p class="text-xs text-slate-500 mt-1 truncate">
                  Author: <span class="font-medium text-slate-700">{{ item.author || 'Unknown' }}</span>
                </p>
              </div>

              <!-- Location Metadata -->
              <div class="mt-3 pt-2.5 border-t border-slate-100 text-xs">
                <!-- If OPEN: Show shelf number & pick-up info -->
                <div v-if="resolveShelfType(item) === 'OPEN'" class="space-y-1">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-slate-400 font-medium">Shelf:</span>
                    <span class="font-bold font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {{ item.shelf_number || 'A-01' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Call: <strong class="font-mono text-slate-700">{{ item.call_number || 'N/A' }}</strong></span>
                    <span class="text-emerald-600 font-semibold truncate max-w-[120px]">✓ {{ formatDisplayLocation(item) }}</span>
                  </div>
                </div>

                <!-- If CLOSED: Obscure exact shelf number, mark restricted -->
                <div v-else class="space-y-1">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-slate-400 font-medium">Access:</span>
                    <span class="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Restricted Stack</span>
                  </div>
                  <div class="flex items-center justify-between text-[10px] text-slate-500">
                    <span>ID: <strong class="font-mono text-slate-700">#{{ item.item_id }}</strong></span>
                    <span class="text-amber-600 font-semibold">⚠ Retrieval Required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="p-3 bg-slate-50/90 border-t border-slate-100 rounded-b-2xl grid gap-2"
               :class="resolveShelfType(item) === 'CLOSED' ? 'grid-cols-2' : 'grid-cols-1'">

            <button @click="openDetails(item)"
              class="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
              <span>🔍</span><span>View Details</span>
            </button>

            <!-- ONLY CLOSED SHELF gets a Request Button -->
            <button
              v-if="resolveShelfType(item) === 'CLOSED'"
              @click="requestBook(item)"
              :disabled="requestingId === item.item_id || !isBookAvailable(item)"
              class="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <span v-if="requestingId === item.item_id">Submitting...</span>
              <span v-else-if="!isBookAvailable(item)">Loaned Out</span>
              <span v-else>🔒 Request</span>
            </button>

            <!-- OPEN SHELF shows direct walk-in badge -->
            <div v-else class="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold flex items-center justify-center gap-1.5">
              <span>📍</span>
              <span>Available at Shelf {{ item.shelf_number || 'A-01' }} — Walk In</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 p-8 max-w-md mx-auto shadow-sm">
        <div class="text-5xl mb-3">📚</div>
        <h3 class="text-base font-bold text-slate-800">No matching books found</h3>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          No records match your keyword or active filters. Try adjusting the category or shelf access.
        </p>
        <button @click="resetAllFilters"
          class="mt-4 px-5 py-2.5 bg-[#01ACF2] text-white rounded-xl text-xs font-bold hover:bg-[#008fcc] transition shadow-md cursor-pointer">
          Reset All Filters
        </button>
      </div>
    </main>

    <!-- ══════════════════════════════════════════════════════
         DETAILS MODAL
         ══════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showDetailModal && selectedBook"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        @click.self="closeDetails">
        <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-scale-up">

          <div class="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold text-[#0072b2] uppercase tracking-wider">{{ selectedBook.resolvedCategory }}</span>
              <span class="text-slate-300">|</span>
              <span v-if="selectedBook.resolvedShelfType === 'CLOSED'" class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">🔒 Closed Stack</span>
              <span v-else class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">🟢 Open Shelf</span>
            </div>
            <button @click="closeDetails" class="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer">✕</button>
          </div>

          <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <div class="flex flex-col sm:flex-row gap-5 items-start">
              <div class="w-24 h-36 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl border border-sky-200 flex flex-col items-center justify-center p-2 text-4xl shrink-0 shadow-xs">
                <span>📖</span>
                <span class="text-[9px] font-mono text-slate-500 mt-2">{{ selectedBook.barcode }}</span>
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-serif font-bold text-slate-800 leading-snug">{{ selectedBook.title }}</h2>
                <p class="text-xs text-slate-600 mt-1">Author: <strong class="text-slate-800">{{ selectedBook.author || 'Unknown' }}</strong></p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Publisher: {{ selectedBook.publisher }} • Year: {{ selectedBook.publication_year }} • Edition: {{ selectedBook.edition }}
                </p>
                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <span :class="[
                    'text-xs font-bold px-2.5 py-1 rounded-md',
                    isBookAvailable(selectedBook) ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                  ]">
                    {{ isBookAvailable(selectedBook)
                      ? `✓ ${selectedBook.availableCount} of ${selectedBook.totalCount} Copies Available`
                      : 'Currently Checked Out' }}
                  </span>
                  <span class="text-xs text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded cursor-pointer hover:bg-slate-200 transition"
                        @click="copyToClipboard(selectedBook.isbn || '')">
                    ISBN: {{ selectedBook.isbn || 'N/A' }} 📋
                  </span>
                </div>
              </div>
            </div>

            <!-- Shelf Rules in Modal -->
            <div class="rounded-xl p-4 border"
              :class="selectedBook.resolvedShelfType === 'CLOSED' ? 'bg-amber-50/80 border-amber-200' : 'bg-emerald-50/80 border-emerald-200'">

              <!-- OPEN SHELF SPECIFICS -->
              <div v-if="selectedBook.resolvedShelfType === 'OPEN'">
                <div class="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                  <span>🟢 OPEN SHELF LOCATION</span>
                </div>
                <p class="text-xs text-slate-600 mb-3 leading-relaxed">
                  This book is shelved in the public stack. Students may pick it directly from the shelf without staff assistance.
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-emerald-100 text-xs">
                  <div><span class="text-[10px] text-slate-400 block font-medium">Shelf #</span><strong class="text-slate-800 font-mono">{{ selectedBook.shelf_number }}</strong></div>
                  <div><span class="text-[10px] text-slate-400 block font-medium">Sub-Shelf</span><strong class="text-slate-800 font-mono">{{ selectedBook.sub_shelf_number }}</strong></div>
                  <div><span class="text-[10px] text-slate-400 block font-medium">Call #</span><strong class="text-slate-800 font-mono">{{ selectedBook.call_number }}</strong></div>
                  <div><span class="text-[10px] text-slate-400 block font-medium">Location</span><strong class="text-slate-800">{{ selectedBook.location }}</strong></div>
                </div>
              </div>

              <!-- CLOSED SHELF SPECIFICS -->
              <div v-else>
                <div class="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                  <span>🔒 CLOSED STACK ARCHIVE</span>
                </div>
                <p class="text-xs text-slate-700 mb-2 leading-relaxed">
                  This book is maintained in the secure archives and cannot be browsed directly on shelves. Submit a retrieval request below to have library staff pull it for you.
                </p>
                <div class="bg-white p-3 rounded-lg border border-amber-200 text-xs text-slate-600 space-y-1">
                  <p>• Internal shelf positions are obscured for collection preservation.</p>
                  <p>• Click <strong>"Request from Librarian"</strong> to place a reserve ticket.</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div><span class="text-slate-400 block text-[10px]">Barcode</span><span class="font-bold font-mono text-slate-700">{{ selectedBook.barcode }}</span></div>
              <div><span class="text-slate-400 block text-[10px]">Loan Period</span><span class="font-bold text-slate-700">14 Days</span></div>
              <div><span class="text-slate-400 block text-[10px]">Catalog Status</span><span class="font-bold text-emerald-700">{{ selectedBook.status || 'AVAILABLE' }}</span></div>
              <div><span class="text-slate-400 block text-[10px]">Item ID</span><span class="font-bold font-mono text-slate-700">#{{ selectedBook.item_id }}</span></div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button @click="closeDetails" class="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition cursor-pointer">Close</button>

            <!-- Closed Stack: Request Button -->
            <button
              v-if="selectedBook.resolvedShelfType === 'CLOSED'"
              @click="requestBook(selectedBook); closeDetails()"
              :disabled="!isBookAvailable(selectedBook)"
              class="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer">
              🔒 Request from Librarian
            </button>

            <!-- Open Shelf: Informative banner -->
            <div v-else class="px-5 py-2.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <span>📍</span>
              <span>Available at Shelf {{ selectedBook.shelf_number }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════════════
         RETRIEVAL FORM (CLOSED SHELF ONLY)
         ══════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showGuestForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="cancelRequest">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-scale-up">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg">🔒</div>
            <div>
              <h3 class="text-base font-bold text-slate-800">Request from Closed Stack</h3>
              <p class="text-xs text-slate-500">Staff will retrieve this item from the archives.</p>
            </div>
          </div>

          <div v-if="selectedItemTitle" class="my-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div class="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Selected Book:</div>
            <div class="text-xs font-bold text-slate-800 line-clamp-2">{{ selectedItemTitle }}</div>
          </div>

          <div class="space-y-3.5 my-5">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Student / Borrower Full Name</label>
              <input v-model="guestName" type="text" placeholder="e.g. Abebe Kebede" class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition font-medium" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Number (SMS Notification)</label>
              <input v-model="guestPhone" type="tel" placeholder="+251 9..." class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition font-medium" />
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="cancelRequest" class="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer">Cancel</button>
            <button @click="submitRequest" :disabled="!!requestingId"
              class="flex-1 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 disabled:bg-amber-300 transition shadow-sm cursor-pointer">
              {{ requestingId ? 'Submitting...' : 'Confirm Request' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Component -->
    <Transition name="fade">
      <div v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl font-medium text-xs text-white flex items-center gap-2',
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600',
        ]">
        <span>{{ toast.type === 'success' ? '✓' : '⚠' }}</span>
        <span>{{ toast.msg }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.catalog-book-card {
  background-color: #ffffff;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.catalog-book-card:hover {
  transform: translateY(-3px);
  border-color: #01acf2;
  box-shadow: 0 10px 20px rgba(1, 172, 242, 0.08);
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes scaleUp {
  0% { transform: scale(0.97); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-scale-up { animation: scaleUp 0.18s ease-out forwards; }
</style>