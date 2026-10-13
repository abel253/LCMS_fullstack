<template>
  <div class="min-h-screen bg-[#0f172a] text-white p-6 flex flex-col items-center">
    <div class="w-full max-w-md pt-10">
      
      <button @click="goBack" class="mb-4 text-gray-400 hover:text-white flex items-center gap-2">
        <span>←</span> Back
      </button>

      <div class="flex flex-col items-center mb-8">
        <div class="w-24 h-24 bg-lime-400/10 border border-lime-400/20 rounded-full flex items-center justify-center text-4xl mb-6">
          👤
        </div>
        <h2 class="text-2xl font-bold">Personalize Your Account</h2>
        <p class="text-gray-400 text-center mt-2">Set your details to unlock all features.</p>
      </div>

      <form @submit.prevent="handleComplete" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
          <input 
            v-model="profile.name" 
            type="text" 
            placeholder="e.g. Abebe Balcha"
            class="w-full bg-slate-800 border p-4 rounded-xl focus:ring-2 focus:ring-lime-400 outline-none text-white"
            :class="errors.name ? 'border-red-500' : 'border-slate-700'"
            @blur="validateName"
            required 
          />
          <p v-if="errors.name" class="text-red-400 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Security Password *</label>
          <input 
            v-model="profile.password" 
            type="password" 
            placeholder="Create password"
            class="w-full bg-slate-800 border p-4 rounded-xl focus:ring-2 focus:ring-lime-400 outline-none text-white"
            :class="errors.password ? 'border-red-500' : 'border-slate-700'"
            @blur="validatePassword"
            required 
          />
          <p v-if="errors.password" class="text-red-400 text-sm mt-1">{{ errors.password }}</p>
          <p class="text-gray-500 text-xs mt-1">Password must be at least 6 characters</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Confirm Password *</label>
          <input 
            v-model="profile.confirmPassword" 
            type="password" 
            placeholder="Repeat password"
            class="w-full bg-slate-800 border p-4 rounded-xl focus:ring-2 focus:ring-lime-400 outline-none text-white"
            :class="errors.confirmPassword ? 'border-red-500' : 'border-slate-700'"
            @blur="validateConfirmPassword"
            required 
          />
          <p v-if="errors.confirmPassword" class="text-red-400 text-sm mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <!-- General Error -->
        <p v-if="error" class="text-red-400 text-center text-sm">{{ error }}</p>

        <button 
          :disabled="loading || !isFormValid" 
          type="submit"
          class="w-full bg-lime-400 text-black py-4 rounded-xl font-black text-sm uppercase tracking-wider mt-6 transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'PROCESSING...' : 'FINISH & START EXPLORING' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const error = ref('')

const profile = reactive({
  name: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  name: '',
  password: '',
  confirmPassword: ''
})

// Validation Functions
const validateName = () => {
  if (!profile.name.trim()) {
    errors.name = 'Full name is required'
    return false
  }
  if (profile.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
    return false
  }
  if (profile.name.trim().length > 50) {
    errors.name = 'Name must be less than 50 characters'
    return false
  }
  errors.name = ''
  return true
}

const validatePassword = () => {
  if (!profile.password) {
    errors.password = 'Password is required'
    return false
  }
  if (profile.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  }
  if (profile.password.length > 50) {
    errors.password = 'Password must be less than 50 characters'
    return false
  }
  errors.password = ''
  return true
}

const validateConfirmPassword = () => {
  if (!profile.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    return false
  }
  if (profile.password !== profile.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    return false
  }
  errors.confirmPassword = ''
  return true
}

const validateAll = () => {
  const isNameValid = validateName()
  const isPasswordValid = validatePassword()
  const isConfirmValid = validateConfirmPassword()
  return isNameValid && isPasswordValid && isConfirmValid
}

const isFormValid = computed(() => {
  return profile.name.trim() && 
         !errors.name && 
         profile.password.length >= 6 && 
         !errors.password && 
         profile.confirmPassword === profile.password && 
         !errors.confirmPassword
})

// Check token on mount
onMounted(() => {
  // Get token from query params
  if (route.query.token) {
    authStore.token = route.query.token as string
  }
  
  // Also check localStorage
  if (!authStore.token) {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      authStore.token = savedToken
    }
  }
  
  // If still no token, redirect
  if (!authStore.token) {
    error.value = 'Session expired. Please login again.'
    setTimeout(() => {
      router.push('/auth')
    }, 2000)
  }
})

const handleComplete = async () => {
  // Validate all fields
  if (!validateAll()) {
    return
  }

  // Check token
  if (!authStore.token) {
    error.value = 'Session expired. Please login again.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('Completing profile with token:', authStore.token)
    console.log('Profile data:', {
      name: profile.name,
      password: '********',
      password_confirmation: '********'
    })

    const response = await authStore.completeProfile({
      name: profile.name.trim(),
      password: profile.password,
      password_confirmation: profile.confirmPassword
    })

    console.log('Complete Profile Response:', response)

    if (response.success) {
      // Update user data
      if (response.data?.user) {
        authStore.user = response.data.user
        localStorage.setItem('auth_user', JSON.stringify(response.data.user))
      }
      
      await router.push('/')
    } else {
      error.value = response.message || 'Failed to complete profile. Please try again.'
    }

  } catch (err: any) {
    console.error('Complete Profile Error:', err)
    
    if (err?.message) {
      error.value = err.message
    } else if (err?.errors) {
      const errorMessages = Object.values(err.errors).flat().join(', ')
      error.value = errorMessages || 'Please check your inputs and try again.'
    } else {
      error.value = 'Failed to complete profile. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/auth')
}
</script>