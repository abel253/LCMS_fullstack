<<<<<<< HEAD
// app/stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  user_type: string
=======
// stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  phone?: string
  user_type: 'student' | 'librarian' | 'admin'
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
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
<<<<<<< HEAD
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
=======
    tempPhone: ''
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isLibrarian: (state) => state.user?.user_type === 'librarian' || state.user?.role === 'librarian',
    isStudent: (state) => state.user?.user_type === 'student' || state.user?.role === 'student',
    userFullName: (state) => state.user?.name || 'User'
  },
  
  actions: {
    init() {
      if (process.client) {
        const token = window.localStorage.getItem('auth_token')
        const user = window.localStorage.getItem('auth_user')
        if (token) this.token = token
        if (user) this.user = JSON.parse(user)
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      this.tempEmail = ''
      this.tempPhone = ''
      
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        localStorage.removeItem('userRole')
      }
      navigateTo('/auth')
    }
  }
})
// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    tempEmail: '',
    tempPhone: '',
    googleLoading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) =>
      String(state.user?.role || '').toLowerCase() === 'admin',
    isPartner: (state) => {
      const role = String(state.user?.role || '').toLowerCase()
      return role === 'partner' || role === 'owner'
    },
  },

  actions: {
    /* ═══════════════════════════════════════════
       API URL BUILDER
       ✅ apiBase already ends with /api
       ═══════════════════════════════════════════ */
    getApiUrl(path: string) {
      const config = useRuntimeConfig()
      const base = String(config.public.apiBase || '').replace(/\/$/, '')
      const cleanPath = path.startsWith('/') ? path : `/${path}`
      return `${base}${cleanPath}`
    },

    /* ═══════════════════════════════════════════
       SAVE AUTH
       ═══════════════════════════════════════════ */
    saveAuth(token: string, user: any) {
      this.token = token
      this.user = user

      if (import.meta.client) {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
        localStorage.setItem('userRole', user?.role || 'student')

        const cookie = useCookie<string | null>('auth_token', {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
          sameSite: 'lax',
        })
        cookie.value = token

        const roleState = useState('userRole')
        roleState.value = user?.role || 'user'
      }
    },

    /* ═══════════════════════════════════════════
       LOGIN
       ═══════════════════════════════════════════ */
    async login(payload: { email: string; password: string }) {
      try {
        const res: any = await $fetch(this.getApiUrl('/auth/login'), {
          method: 'POST',
          body: payload,
          timeout: 30000,
          headers: { Accept: 'application/json' },
        })

        if (res.success) {
          const token = res.data?.token || res.token
          const user = res.data?.user || res.user
          if (token) this.saveAuth(token, user)
        }
        return res
      } catch (error: any) {
        if (error.status === 404) {
          throw { message: 'user not found ፤ please first register' }
        }
        if (error.status === 401) {
          throw { message: 'invalid credintial' }
        }
        throw error.data || { message: 'server error!' }
      }
    },

    /* ═══════════════════════════════════════════
       SEND OTP
       ═══════════════════════════════════════════ */
    async sendOTP(payload: { email: string; phone: string }) {
      try {
        const res: any = await $fetch(this.getApiUrl('/auth/send-otp'), {
          method: 'POST',
          body: payload,
          timeout: 600000,
        })
        this.tempEmail = payload.email
        this.tempPhone = payload.phone
        return res
      } catch (error: any) {
        throw error.data || { message: 'Failed to send OTP' }
      }
    },

    /* ═══════════════════════════════════════════
       VERIFY OTP
       ═══════════════════════════════════════════ */
    async verifyOTP(email: string, otp: string) {
      try {
        const res: any = await $fetch(this.getApiUrl('/auth/verify-otp'), {
          method: 'POST',
          body: { email, otp },
        })

        if (res.success) {
          const token = res.data?.token || res.token
          const user = res.data?.user || res.user
          if (token) this.saveAuth(token, user)
        }
        return res
      } catch (error: any) {
        throw error.data || error
      }
    },

    /* ═══════════════════════════════════════════
       COMPLETE PROFILE
       ═══════════════════════════════════════════ */
    async completeProfile(payload: {
      name: string
      password: string
      password_confirmation: string
    }) {
      try {
        const res: any = await $fetch(
          this.getApiUrl('/auth/complete-profile'),
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.token}`,
              'Content-Type': 'application/json',
            },
            body: payload,
          },
        )

        if (res.success) {
          const newToken = res.data?.token || this.token
          const newUser = res.data?.user || this.user
          if (newToken) this.saveAuth(newToken, newUser)
        }
        return res
      } catch (error: any) {
        throw error.data || error
      }
    },

    /* ═══════════════════════════════════════════
       FETCH USER
       ═══════════════════════════════════════════ */
    async fetchUser() {
      if (!import.meta.client) return null
      if (!this.token) this.init()
      if (!this.token) return null

      try {
        const res: any = await $fetch(this.getApiUrl('/auth/me'), {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
          },
        })

        const user = res?.user ?? res?.data ?? null
        if (user) {
          this.user = user
          localStorage.setItem('auth_user', JSON.stringify(user))
        }
        return user
      } catch (error: any) {
        if (error?.status === 401) this.logout()
        return null
      }
    },

    /* ═══════════════════════════════════════════
       INIT
       ═══════════════════════════════════════════ */
    init() {
      if (!import.meta.client) return

      let token =
        localStorage.getItem('auth_token') || localStorage.getItem('token')

      if (!token) {
        const cookie = useCookie<string | null>('auth_token')
        if (cookie.value) token = cookie.value
      }

      if (token) this.token = token

      const user = localStorage.getItem('auth_user')
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
      if (user) {
        try {
          this.user = JSON.parse(user)
        } catch {
          this.user = null
        }
      }
<<<<<<< HEAD
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
=======

      const role = localStorage.getItem('userRole')
      if (role) {
        const roleState = useState('userRole')
        roleState.value = role
      }
    },

    /* ═══════════════════════════════════════════
       LOGOUT
       ═══════════════════════════════════════════ */
    logout() {
      this.token = null
      this.user = null

      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token')
        localStorage.removeItem('auth_user')
        localStorage.removeItem('userRole')

        const cookie = useCookie<string | null>('auth_token')
        cookie.value = null

        const roleState = useState('userRole')
        roleState.value = null
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
      }
    },
  },
})