<template>
  <header class="relative w-full z-50 bg-[#01ACF2] shadow-xl border-b border-[#01ACF2]">
    
    <!-- DESKTOP HEADER -->
    <div class="hidden lg:block container-custom relative h-[100px] xl:h-[110px]">
      
      <!-- Top Utilities Row -->
      <div class="flex justify-end items-center pt-2 pb-1 text-[#0B2545] text-[11px] xl:text-xs font-medium gap-2 xl:gap-3 tracking-wide relative z-20">
        <!-- Search Bar -->
        <div class="relative mr-2 xl:mr-3">
          <input type="text" placeholder="Search..." 
                 class="bg-transparent border border-white/30 rounded-full px-4 py-1 w-48 xl:w-64 text-white focus:outline-none focus:border-white placeholder-gray-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <NuxtLink to="#" class="hover:text-[#245e9c] transition-colors">News</NuxtLink>
        <span class="text-[#0B2545]/30">|</span>
        <NuxtLink to="#" class="hover:text-[#245e9c] transition-colors">Events</NuxtLink>
        <span class="text-[#0B2545]/30">|</span>
        <NuxtLink to="#" class="hover:text-[#245e9c] transition-colors">E-Learning</NuxtLink>
        <span class="text-[#0B2545]/30">|</span>
        <NuxtLink to="#" class="hover:text-[#245e9c] transition-colors">Email</NuxtLink>
        <span class="text-[#0B2545]/30">|</span>
        
        <!-- Language Selector -->
        <div class="flex items-center gap-1 cursor-pointer hover:text-gold-400 transition-colors ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          EN
          <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Logo and University Name -->
      <div class="absolute left-0 top-2 flex items-start z-20">
        <!-- Diamond Logo Wrapper -->
        <div class="relative w-20 h-20 xl:w-24 xl:h-24 flex items-center justify-center mr-4 xl:mr-5">
          <div class="w-14 h-14 xl:w-16 xl:h-16 bg-white rotate-45 overflow-hidden border-[2px] border-[#5BC0EB] shadow-lg flex items-center justify-center">
             <img src="~/assets/images/maus.jpg" class="w-[140%] h-[140%] -rotate-45 object-contain" alt="MAU Logo" />
          </div>
        </div>
        
        <!-- Text -->
        <div class="pt-0.5 xl:pt-1">
          <h1 class="text-[#0B2545] text-xl xl:text-2xl font-serif font-bold tracking-wide shadow-sm leading-tight">Mekdela Amba University</h1>
          <h2 class="text-[#275d8e] text-sm xl:text-base font-bold mt-0.5 font-serif tracking-wider shadow-sm">መቅደላ አምባ ዩኒቨርሲቲ</h2>
        </div>
      </div>
    </div>

    <!-- DESKTOP BOTTOM WHITE NAV BAR -->
    <div class="hidden lg:block absolute bottom-0 right-0 h-10 xl:h-11 bg-white/90 shadow-lg z-10 w-[70%] xl:w-[75%]" 
         style="clip-path: polygon(25px 0, 100% 0, 100% 100%, 0 100%);">
      <div class="w-full h-full pl-8 xl:pl-12 pr-4 xl:pr-6">
        <ul class="flex items-center justify-between w-full h-full text-[#0B2545] font-bold text-[11px] xl:text-xs">
          <li v-for="link in navLinks" :key="link.path" class="h-full flex items-center">
            <NuxtLink :to="link.path" 
                      class="h-full flex items-center px-1.5 xl:px-2 hover:text-[#245e9c] transition-colors"
                      :class="{ 'border-b-[3px] border-[#5bb1e8] text-[#0B2545] pt-[3px]': $route.path === link.path, 'pt-[3px]': $route.path !== link.path }">
              {{ link.label }}
              <svg v-if="link.hasDropdown" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 ml-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </NuxtLink>
            <span v-if="link.label !== 'Contact'" class="text-gray-300 ml-2 xl:ml-3 font-normal opacity-50">|</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- MOBILE HEADER -->
    <div class="lg:hidden bg-[#01ACF2] border-b border-[#01ACF2]">
      <div class="container-custom flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <div class="w-10 h-10 bg-white rotate-45 overflow-hidden flex items-center justify-center">
             <img src="~/assets/images/maus.jpg" class="w-[140%] h-[140%] -rotate-45 object-contain" alt="MAU Logo" />
          </div>
          <div>
            <span class="block text-[#0B2545] font-serif font-bold text-base leading-tight">Mekdela Amba</span>
            <span class="block text-[#275d8e] font-serif text-xs">ዩኒቨርሲቲ</span>
          </div>
        </NuxtLink>
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="p-2 text-[#0B2545]">
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <!-- MOBILE MENU CONTENT -->
    <transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="lg:hidden absolute top-full left-0 w-full bg-[#EAF9FF] shadow-xl z-50">
        <div class="p-4 border-b border-gray-100">
          <input type="text" placeholder="Search..." class="w-full px-4 py-2 border border-[#01ACF2] rounded-md bg-white/80" />
        </div>
        <div class="p-2">
          <NuxtLink v-for="link in navLinks" :key="link.path" :to="link.path" @click="isMobileMenuOpen = false"
            class="block px-4 py-3 text-[#0B2545] font-bold border-b border-gray-100 hover:bg-white/60">
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </transition>
    
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const navLinks = [
  { path: '/', label: 'Home', hasDropdown: false },
  { path: '/about', label: 'About', hasDropdown: true },
  { path: '/academics', label: 'Academics', hasDropdown: true },
  { path: '/search', label: 'search books', hasDropdown: true },
  { path: '/research', label: 'Research', hasDropdown: true },
  { path: '/auth', label: 'Student Portal', hasDropdown: false },
  { path: '/contact', label: 'Contact', hasDropdown: false },
  { path: '/auth', label: 'Login', hasDropdown: false },
]
</script>

<style scoped>
.mobile-menu-enter-active, .mobile-menu-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}
.mobile-menu-enter-from, .mobile-menu-leave-to {
  max-height: 0;
}
</style>