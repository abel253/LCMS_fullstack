<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#070b10]">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#0b1320] border-r border-gray-200 dark:border-slate-800 z-50">
      <div class="p-6">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-2xl font-black text-gray-900 dark:text-white">ETHIOSPORT</span>
        </NuxtLink>
      </div>
      
      <nav class="px-4 space-y-1">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all"
          :class="route.path === item.path ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="ml-64">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Sidebar Menu Items (Admin ለሆነ)
const menuItems = computed(() => {
  const items = [
    { path: '/admin', label: 'Overview', icon: 'lucide:layout-dashboard' },
    { path: '/admin/approvals', label: 'Approvals', icon: 'lucide:check-circle' },
    { path: '/admin/bookings', label: 'Booking Confirmation', icon: 'lucide:wallet' },
    { path: '/admin/partners', label: 'Partners', icon: 'lucide:users' },
    { path: '/admin/users', label: 'user-check', icon: 'lucide:user-check' },
    { path: '/admin/payouts', label: 'wallet', icon: 'lucide:wallet' },
    { path: '/admin/reports', label: 'wallet', icon: 'lucide:file-text' },
    { path: '/admin/settings', label: 'Settings', icon: 'lucide:settings' },
  ]

  // Admin ለሆነ 'My Venues' ን ይጨምሩ
  if (authStore.user?.role === 'admin') {
    items.push({ 
      path: '/admin/my-venues', 
      label: 'My Venues', 
      icon: 'lucide:map-pin' 
    })
  }

  return items
})
</script>