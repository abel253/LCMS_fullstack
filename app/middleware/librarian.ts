// middleware/librarian.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (process.client) {
    authStore.init()
  }
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth')
  }
  
  if (!authStore.isLibrarian) {
    return navigateTo('/')
  }
})