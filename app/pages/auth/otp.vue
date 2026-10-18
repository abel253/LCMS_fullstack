<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center p-6">
    <div class="w-full max-w-md text-left">
      
      <button @click="goBack" class="mb-6 text-gray-500 hover:text-gray-700 flex items-center gap-2">
        <span>←</span> Back
      </button>

      <h1 class="text-3xl font-extrabold mb-2">Enter OTP</h1>
      <p class="text-gray-500 mb-10">
        We sent a 6-digit code to 
        <span class="font-semibold text-gray-700">{{ authStore.tempEmail || 'your email' }}</span>
      </p>

      <div class="space-y-6">
        <!-- OTP Input Fields -->
        <div class="flex justify-center gap-3">
          <input
            v-for="(digit, index) in 6"
            :key="index"
            :ref="el => { if (el) otpInputs[index] = el as HTMLInputElement }"
            v-model="otpDigits[index]"
            type="text"
            maxlength="1"
            inputmode="numeric"
            pattern="[0-9]"
            class="w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
                   text-gray-900 transition-all"
            :class="{
              'border-blue-500 ring-2 ring-blue-200': activeIndex === index,
              'border-red-300': error && otpDigits[index]
            }"
            @focus="activeIndex = index"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
            @paste="handlePaste"
            required
          />
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-red-500 text-center text-sm">{{ error }}</p>

        <!-- Timer / Resend -->
        <div class="text-center">
          <p v-if="timer > 0" class="text-gray-500 text-sm">
            Resend code in 
            <span class="font-semibold text-gray-700">{{ timer }}s</span>
          </p>
          <button 
            v-else 
            @click="handleResend" 
            :disabled="resending"
            class="text-blue-600 font-semibold hover:text-blue-700 disabled:opacity-50"
          >
            {{ resending ? 'Sending...' : 'Resend OTP' }}
          </button>
        </div>

        <!-- Verify Button -->
        <button 
          @click="handleVerify" 
          :disabled="loading || !isOTPComplete"
          class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg
                 hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {{ loading ? 'VERIFYING...' : 'VERIFY OTP' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const resending = ref(false)
const error = ref('')
const timer = ref(60)
const activeIndex = ref(0)

const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpInputs = ref<HTMLInputElement[]>([])

let timerInterval: any = null 

// Validation: Check if all digits are filled
const isOTPComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '' && digit.length === 1)
})

const getOTPCode = computed(() => {
  return otpDigits.value.join('')
})

// Validation: Only allow digits
const isValidDigit = (char: string) => /^[0-9]$/.test(char)

const handleInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const char = input.value.replace(/\D/g, '')
  
  // Validate digit
  if (char.length > 0 && !isValidDigit(char)) {
    input.value = otpDigits.value[index] || ''
    return
  }
  
  if (char.length > 0) {
    otpDigits.value[index] = char.charAt(0)
    
    if (index < 5) {
      otpInputs.value[index + 1]?.focus()
      activeIndex.value = index + 1
    }
  }
  
  if (error.value) error.value = ''
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpInputs.value[index - 1]?.focus()
      activeIndex.value = index - 1
      otpDigits.value[index - 1] = ''
    } else {
      otpDigits.value[index] = ''
    }
  }
}

const handlePaste = (event: ClipboardEvent) => {
  const pasteData = event.clipboardData?.getData('text') || ''
  const cleaned = pasteData.replace(/\D/g, '').split('').slice(0, 6)
  
  // Validate pasted content
  if (cleaned.length === 6 && cleaned.every(char => isValidDigit(char))) {
    otpDigits.value = [...cleaned]
    otpInputs.value[5]?.focus()
    activeIndex.value = 5
    if (error.value) error.value = ''
  } else {
    error.value = 'Please paste a valid 6-digit code'
  }
}

const handleVerify = async () => {
  // Validate OTP is complete
  if (!isOTPComplete.value) {
    error.value = 'Please enter all 6 digits'
    return
  }
  
  // Validate OTP is numeric
  if (!/^\d{6}$/.test(getOTPCode.value)) {
    error.value = 'OTP must be 6 digits'
    return
  }
  
  // Validate email exists
  if (!authStore.tempEmail) {
    error.value = 'Email not found. Please go back and try again.'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await authStore.verifyOTP(
      authStore.tempEmail, 
      getOTPCode.value
    )
    
    console.log('OTP Response:', response)
    
    if (response.success) {
      // Store token properly
      if (response.data?.token) {
        authStore.token = response.data.token
      }
      if (response.data?.user) {
        authStore.user = response.data.user
      }
      
      // Save to localStorage
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      if (response.data?.user) {
        localStorage.setItem('auth_user', JSON.stringify(response.data.user))
      }
      
      // Check next screen
      const nextScreen = response.data?.next_screen || response.next_screen
      
      if (nextScreen === 'complete_profile') {
        await router.push({
          path: '/auth/complete-profile',
          query: { token: authStore.token || '' }
        })
      } else {
        await router.push('/')
      }
    } else {
      error.value = response.message || 'Invalid OTP. Please try again.'
      // Reset OTP on error
      otpDigits.value = ['', '', '', '', '', '']
      otpInputs.value[0]?.focus()
      activeIndex.value = 0
    }
  } catch (err: any) {
    console.error('Verification Error:', err)
    error.value = err.message || 'Verification failed. Please try again.'
    // Reset OTP on error
    otpDigits.value = ['', '', '', '', '', '']
    otpInputs.value[0]?.focus()
    activeIndex.value = 0
  } finally {
    loading.value = false
  }
}

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  timer.value = 60
  timerInterval = setInterval(() => {
    if (timer.value > 0) timer.value--
    else clearInterval(timerInterval)
  }, 1000)
}

const handleResend = async () => {
  // Validate email exists
  if (!authStore.tempEmail) {
    error.value = 'Email not found. Please go back and try again.'
    return
  }
  
  resending.value = true
  error.value = ''
  
  try {
    const res = await authStore.sendOTP({ 
      email: authStore.tempEmail, 
      phone: authStore.tempPhone || '' 
    })
    
    if (res.success) {
      startTimer()
      otpDigits.value = ['', '', '', '', '', '']
      otpInputs.value[0]?.focus()
      activeIndex.value = 0
      alert('New OTP has been sent to your email')
    } else {
      error.value = res.message || 'Failed to resend OTP'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to resend OTP. Please try again.'
  } finally {
    resending.value = false
  }
}

onMounted(() => {
  // Validate email
  if (!authStore.tempEmail && route.query.email) {
    authStore.tempEmail = route.query.email as string
  }
  
  if (route.query.token) {
    authStore.token = route.query.token as string
  }
  
  if (!authStore.tempEmail) {
    router.push('/auth')
    return
  }
  
  startTimer()
  setTimeout(() => otpInputs.value[0]?.focus(), 500)
})

onUnmounted(() => { 
  if (timerInterval) clearInterval(timerInterval) 
})

const goBack = () => router.push('/auth')
</script>