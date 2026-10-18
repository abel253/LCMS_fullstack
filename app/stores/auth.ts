// app/stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  user_type: string
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
    isLibrarian: (state) =>
      String(state.user?.user_type || '').toLowerCase() === 'librarian',
    isStudent: (state) =>
      String(state.user?.user_type || '').toLowerCase() === 'student',
    isAdmin: (state) =>
      String(state.user?.user_type || '').toLowerCase() === 'administrator',
    userFullName: (state) => state.user?.name || 'User',
  },

  actions: {
    init() {
      if (!import.meta.client) return
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('auth_user')
      if (token) this.token = token
      if (user) {
        try {
          this.user = JSON.parse(user)
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
        if (status === 404)
          throw { message: 'User not found — please register first.' }
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
        throw {
          message: error?.data?.statusMessage || 'Registration failed',
        }
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
        throw {
          message: error?.data?.statusMessage || 'Failed to send OTP',
        }
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

    async fetchUser() {
      if (!import.meta.client) return null
      if (!this.token) this.init()
      if (!this.token) return null

      try {
        const res: any = await $fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        if (res.user) {
          this.user = res.user
          localStorage.setItem('auth_user', JSON.stringify(res.user))
        }
        return res.user
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
        localStorage.removeItem('auth_user')
        const cookie = useCookie<string | null>('auth_token')
        cookie.value = null
      }
    },
  },
})