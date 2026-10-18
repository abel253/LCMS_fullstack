// composables/useAuth.ts
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { user, token } = storeToRefs(authStore)

  return {
    user,
    token,
    isAuthenticated: computed(() => !!token.value),
    userRole: computed(() => user.value?.role),
    // ለ Real Backend ብቻ የሚሰሩ ዘዴዎች
    login: authStore.login,
    logout: authStore.logout,
    init: authStore.init,
    sendOTP: authStore.sendOTP,
    verifyOTP: authStore.verifyOTP,
    completeProfile: authStore.completeProfile
  }
}