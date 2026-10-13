export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'partner' | 'user' // 'user' እዚህ ጋር ተጨምሯል
  venueName?: string 
}

export const useAuth = () => {
  const user = useState<User | null>('auth_user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role)

  // አዲስ፡ ለተራ ተጠቃሚ (Normal User) መግቢያ
  const loginAsUser = () => {
    user.value = {
      id: 'usr-customer-1',
      name: 'ተጫዋች አበበ',
      email: 'abebe@sport.et',
      role: 'user'
    }
  }

  const loginAsAdmin = () => {
    user.value = { id: 'admin-1', name: 'Admin', email: 'admin@test.et', role: 'admin' }
  }

  const loginAsPartner = () => {
    user.value = { id: 'partner-1', name: 'Partner', email: 'p@test.et', role: 'partner', venueName: 'ሜዳ' }
  }

  const logout = async () => {
    user.value = null
    return navigateTo('/auth')
  }

  return {
    user,
    isAuthenticated,
    userRole,
    loginAsUser, // ለኤክስፖርት ተጨምሯል
    loginAsAdmin,
    loginAsPartner,
    logout
  }
}