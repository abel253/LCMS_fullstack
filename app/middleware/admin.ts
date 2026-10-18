export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, userRole } = useAuth()

  // 1. መጀመሪያ Login ማድረጉን አረጋግጥ። ካላደረገ auth.ts ስራውን ይስራ፣ እዚህ ጋር ይቁም
  if (!isAuthenticated.value) return 

  // 2. አሁን ያለንበት ገጽ Home (/) ከሆነ እዚህ ጋር ይቁም
  if (to.path === '/') return

  // 3. Admin ካልሆነ ወደ Home (/) መልሰው
  if (userRole.value !== 'admin') {
    return navigateTo('/')
  }
})