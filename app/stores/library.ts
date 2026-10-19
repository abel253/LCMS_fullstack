// app/stores/library.ts
import { defineStore } from 'pinia'

export interface LibraryItem {
  item_id: number
  title: string
  author: string
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
  available_quantity?: number
  total_copies: number
  available_copies: number
  is_available: boolean
  item_type?: string
  status?: string
  shelf_type?: 'OPEN' | 'CLOSED'
  [key: string]: any
}

interface GuestInfo {
  name?: string
  phone?: string | null
}

// ── Helper: Normalize raw API data ──
function normalizeItem(raw: any): LibraryItem {
  const total = Number(raw.total_copies ?? raw.quantity ?? raw.total_quantity ?? 1)
  const available = Number(raw.available_copies ?? raw.available_quantity ?? raw.availableQuantity ?? total)
  const status = String(raw.status ?? 'AVAILABLE').toUpperCase()

  // ── shelf_type ን በትክክል አንብብ ──
  const rawShelfType = String(raw.shelf_type ?? '').trim().toUpperCase()
  const shelfType: 'OPEN' | 'CLOSED' = rawShelfType === 'CLOSED' ? 'CLOSED' : 'OPEN'

  return {
    ...raw,
    item_id: Number(raw.item_id ?? raw.id ?? 0),
    title: String(raw.title ?? ''),
    author: String(raw.author ?? ''),
    isbn: String(raw.isbn ?? ''),
    call_number: String(raw.call_number ?? ''),
    location: String(raw.location ?? '').trim(),
    shelf_number: String(raw.shelf_number ?? '').trim(),
    sub_shelf_number: String(raw.sub_shelf_number ?? 'N/A').trim(),
    shelf_type: shelfType,
    total_copies: total,
    available_copies: available,
    quantity: total,
    available_quantity: available,
    is_available:
      available > 0 &&
      status !== 'UNAVAILABLE' &&
      status !== 'LOST' &&
      status !== 'BORROWED' &&
      status !== 'WITHDRAWN',
  }
}

function extractItems(response: any): any[] {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.items)) return response.items
  if (Array.isArray(response?.results)) return response.results
  if (Array.isArray(response?.data?.items)) return response.data.items
  return []
}

export const useLibraryStore = defineStore('library', {
  state: () => ({
    searchResults: [] as LibraryItem[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    availableCount: (state): number =>
      state.searchResults.filter((item) => item.is_available).length,

    totalCount: (state): number =>
      state.searchResults.length,
  },

  actions: {
    async searchBooks(q = '', type = 'title') {
      this.loading = true
      this.error = null

      try {
        const response: any = await $fetch('/api/items/search', {
          params: {
            q: q.trim(),
            type,
            limit: 10000,
          },
        })

        const items = extractItems(response)
        this.searchResults = items.map(normalizeItem)
        return this.searchResults
      } catch (error: any) {
        this.error =
          error?.data?.message ||
          error?.data?.statusMessage ||
          error?.message ||
          'Failed to load library items'

        this.searchResults = []
        throw error
      } finally {
        this.loading = false
      }
    },

    async requestBook(itemId: number, guest?: GuestInfo) {
      try {
        const response: any = await $fetch('/api/requests', {
          method: 'POST',
          body: {
            itemId,
            guestName: guest?.name || 'Student Borrower',
            guestPhone: guest?.phone || null,
          },
        })

        const item = this.searchResults.find((entry) => entry.item_id === itemId)
        if (item) {
          item.available_copies = Math.max(0, item.available_copies - 1)
          item.available_quantity = item.available_copies
          item.is_available = item.available_copies > 0
        }

        return response
      } catch (error: any) {
        const message =
          error?.data?.message ||
          error?.data?.statusMessage ||
          error?.message ||
          'Request failed'
        throw new Error(message)
      }
    },
  },
})