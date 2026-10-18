// stores/research.ts
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
interface Research {
  id: number
  title: string
  college: string
  department: string
  file_path: string
  created_at: string
}

interface ResearchState {
  researchList: Research[]
  loading: boolean
}

export const useResearchStore = defineStore('research', {
  state: (): ResearchState => ({
    researchList: [],
    loading: false
  }),
  
  actions: {
    getApiUrl(path: string) {
      const config = useRuntimeConfig()
      const base = config.public.apiBase.endsWith('/') 
        ? config.public.apiBase.slice(0, -1) 
        : config.public.apiBase
      return `${base}${path}`
    },
    
    async fetchResearch(query: string = '') {
      this.loading = true
      try {
        const res: any = await $fetch(this.getApiUrl(`/research?q=${query}`))
        this.researchList = res.data || []
        return res
      } catch (error) {
        console.error('Fetch research error:', error)
        return { data: [] }
      } finally {
        this.loading = false
      }
    },
    
    async uploadResearch(formData: FormData) {
      this.loading = true
      try {
        const authStore = useAuthStore()
        const res: any = await $fetch(this.getApiUrl('/research/upload'), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          },
          body: formData
        })
        return res
      } catch (error) {
        console.error('Upload error:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})