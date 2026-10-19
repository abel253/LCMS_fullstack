// app/stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: string | number
  name: string
  email: string
  phone?: string
  user_type?: string
  role?: string
}

interface AuthState {
  user: User | null
  token: string | null
  tempEmail: string
  tempPhone: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    tempEmail: '',
    tempPhone: '',
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    
    isLibrarian: (state) => {
      const type = String(state.user?.user_type || state.user?.role || '').toLowerCase()
      return type === 'librarian'
    },
    
    isStudent: (state) => {
      const type = String(state.user?.user_type || state.user?.role || '').toLowerCase()
      return type === 'student'
    },
    
    isAdmin: (state) => {
      const type = String(state.user?.user_type || state.user?.role || '').toLowerCase()
      return type === 'administrator' || type === 'admin'
    },

    userFullName: (state) => state.user?.name || 'User',
  },

  actions: {
    init() {
      if (!import.meta.client) return

      let token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      
      if (!token) {
        const cookie = useCookie<string | null>('auth_token')
        if (cookie.value) token = cookie.value
      }

      if (token) this.token = token

      const userStr = localStorage.getItem('auth_user')
      if (userStr) {
        try {
          this.user = JSON.parse(userStr)
        } catch {
          this.user = null
        }
      }
    },

    saveAuth(token: string, user: User) {
      this.token = token
      this.user = user

      if (!import.meta.client) return
      
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))

      const cookie = useCookie<string | null>('auth_token', {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      })
      cookie.value = token
    },

    async login(payload: { email: string; password: string }) {
      try {
        const res: any = await $fetch('/api/auth/login', {
          method: 'POST',
          body: payload,
        })
        if (res.success) {
          this.saveAuth(res.data.token, res.data.user)
        }
        return res
      } catch (error: any) {
        const status = error?.statusCode || error?.status
        if (status === 404) throw { message: 'User not found — please register first.' }
        if (status === 401) throw { message: 'Invalid credentials.' }
        throw { message: error?.data?.statusMessage || 'Server error!' }
      }
    },

    async register(payload: {
      name: string
      email: string
      password: string
      password_confirmation: string
      phone?: string
    }) {
      try {
        const res: any = await $fetch('/api/auth/register', {
          method: 'POST',
          body: payload,
        })
        if (res.success) {
          this.saveAuth(res.data.token, res.data.user)
        }
        return res
      } catch (error: any) {
        throw { message: error?.data?.statusMessage || 'Registration failed' }
      }
    },

    async sendOTP(payload: { email: string; phone: string }) {
      try {
        const res: any = await $fetch('/api/auth/send-otp', {
          method: 'POST',
          body: payload,
        })
        this.tempEmail = payload.email
        this.tempPhone = payload.phone
        return res
      } catch (error: any) {
        throw { message: error?.data?.statusMessage || 'Failed to send OTP' }
      }
    },

    async verifyOTP(email: string, otp: string) {
      try {
        const res: any = await $fetch('/api/auth/verify-otp', {
          method: 'POST',
          body: { email, otp },
        })
        if (res.success) {
          this.saveAuth(res.data.token, res.data.user)
        }
        return res
      } catch (error: any) {
        throw { message: error?.data?.statusMessage || 'Invalid OTP' }
      }
    },

    async completeProfile(payload: {
      name: string
      password: string
      password_confirmation: string
    }) {
      try {
        const res: any = await $fetch('/api/auth/complete-profile', {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.token}` },
          body: payload,
        })
        if (res.success) {
          const newToken = res.data?.token || this.token
          const newUser = res.data?.user || this.user
          if (newToken && newUser) this.saveAuth(newToken, newUser)
        }
        return res
      } catch (error: any) {
        throw error.data || error
      }
    },

    async fetchUser() {
      if (!import.meta.client) return null
      if (!this.token) this.init()
      if (!this.token) return null

      try {
        const res: any = await $fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        const user = res?.user ?? res?.data ?? null
        if (user) {
          this.user = user
          localStorage.setItem('auth_user', JSON.stringify(user))
        }
        return user
      } catch (error: any) {
        if (error?.statusCode === 401) this.logout()
        return null
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.tempEmail = ''
      this.tempPhone = ''

      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token')
        localStorage.removeItem('auth_user')
        
        const cookie = useCookie<string | null>('auth_token')
        cookie.value = null
      }
      
      navigateTo('/auth')
    },
  },
})