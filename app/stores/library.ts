// app/stores/library.ts
import { defineStore } from 'pinia'

interface LibraryItem {
  item_id: number
  title: string
  author: string
  isbn?: string
  call_number?: string
  total_copies: number
  available_copies: number
  is_available: boolean
}

interface GuestInfo {
  name?: string
  phone?: string | null
}

export const useLibraryStore = defineStore('library', {
  state: () => ({
    searchResults: [] as LibraryItem[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    availableCount: (state) =>
      state.searchResults.filter((i) => i.is_available).length,
  },

  actions: {
    async searchBooks(q = '', type = 'title') {
      this.loading = true
      this.error = null
      try {
        const res: any = await $fetch('/api/items/search', {
          params: { q, type, limit: 100 },
        })
        this.searchResults = Array.isArray(res) ? res : []
        return this.searchResults
      } catch (error: any) {
        this.error = error?.data?.statusMessage || 'Search failed'
        this.searchResults = []
        throw error
      } finally {
        this.loading = false
      }
    },

    // ✅ ሳይገባ ይሰራል — guest info ይቀበላል
    async requestBook(itemId: number, guest?: GuestInfo) {
      try {
        const res: any = await $fetch('/api/requests', {
          method: 'POST',
          body: {
            itemId,
            guestName: guest?.name || 'Guest',
            guestPhone: guest?.phone || null,
          },
        })

        // Local state update
        const idx = this.searchResults.findIndex((i) => i.item_id === itemId)
        if (idx !== -1) {
          this.searchResults[idx].available_copies = Math.max(
            0,
            this.searchResults[idx].available_copies - 1,
          )
          this.searchResults[idx].is_available =
            this.searchResults[idx].available_copies > 0
        }
        return res
      } catch (error: any) {
        throw { message: error?.data?.statusMessage || 'Request failed' }
      }
    },
  },
})