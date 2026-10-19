<template>
<<<<<<< HEAD
  <header class="relative w-full z-50 bg-gradient-to-r from-[#006ea6] via-[#0194d3] to-[#01ACF2] shadow-md">
    
    <!-- ==================== DESKTOP HEADER ==================== -->
    <div class="hidden lg:block relative h-[88px] xl:h-[92px]">
      
      <!-- TOP UTILITIES ROW (Top-Right) -->
      <div class="container-custom flex justify-end items-center pt-1.5 pb-1 text-white text-[11px] font-medium gap-2.5 relative z-20">
        <!-- Compact Search Bar -->
        <div class="relative mr-2">
          <input 
            type="text" 
            placeholder="Search..." 
            class="bg-white/15 hover:bg-white/25 focus:bg-white focus:text-[#0B2545] text-white border border-white/30 rounded-full pl-3 pr-7 py-0.5 text-[11px] w-44 xl:w-56 focus:outline-none transition-all placeholder-white/70 shadow-inner"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <NuxtLink to="#" class="hover:text-amber-300 transition-colors">News</NuxtLink>
        <span class="text-white/40 text-[10px]">|</span>
        <NuxtLink to="#" class="hover:text-amber-300 transition-colors">Events</NuxtLink>
        <span class="text-white/40 text-[10px]">|</span>
        <NuxtLink to="#" class="hover:text-amber-300 transition-colors">E-Learning</NuxtLink>
        <span class="text-white/40 text-[10px]">|</span>
        <NuxtLink to="#" class="hover:text-amber-300 transition-colors">Email</NuxtLink>
        <span class="text-white/40 text-[10px]">|</span>
        
        <!-- Language Selector -->
        <div class="flex items-center gap-1 cursor-pointer hover:text-amber-300 transition-colors text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span>EN</span>
=======
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
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
          <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

<<<<<<< HEAD
      <!-- BRANDING: LOGO, TITLE & MOTTO (Left Side) -->
      <div class="absolute left-4 xl:left-8 top-1.5 flex items-center z-20 pointer-events-none">
        <!-- Diamond Logo -->
        <NuxtLink to="/" class="relative w-14 h-14 xl:w-16 xl:h-16 flex items-center justify-center mr-3 xl:mr-4 shrink-0 pointer-events-auto">
          <div class="w-11 h-11 xl:w-12 xl:h-12 bg-white rotate-45 overflow-hidden border-[2px] border-white/80 shadow-md flex items-center justify-center">
            <img src="~/assets/images/maus.jpg" class="w-[140%] h-[140%] -rotate-45 object-contain" alt="MAU Logo" />
          </div>
        </NuxtLink>
        
        <!-- Text Group -->
        <div class="text-white drop-shadow-sm select-none">
          <h1 class="text-white text-base xl:text-lg font-serif font-bold tracking-wide leading-tight">
            Mekdela Amba University
          </h1>
          <h2 class="text-amber-300 text-xs xl:text-sm font-serif font-semibold tracking-wide leading-tight">
            መቅደላ አምባ ዩኒቨርሲቲ
          </h2>
          <!-- University Motto (እንደ ሁለተኛው ፎቶ) -->
          <p class="text-blue-100/85 text-[10px] xl:text-[11px] font-medium tracking-wide mt-0.5">
            Knowledge <span class="text-amber-300 font-bold">•</span> Innovation <span class="text-amber-300 font-bold">•</span> Service for Society
          </p>
        </div>
      </div>

      <!-- DESKTOP SLENDER WHITE NAV BAR (Bottom Right with Smooth Curve) -->
      <div class="absolute bottom-0 right-0 h-8 xl:h-8.5 z-30 flex items-end">
        
        <!-- Smooth Left Curve (ልክ በፎቶው ላይ እንዳለው የሚያምር ቅስት ቅርጽ) -->
        <svg class="h-full w-9 text-white/95 fill-current shrink-0 -mr-[1px] pointer-events-none drop-shadow-sm" viewBox="0 0 36 34" preserveAspectRatio="none">
          <path d="M36 0 C22 0 14 34 0 34 L36 34 Z" />
        </svg>

        <!-- White Menu Bar Body -->
        <div class="h-full bg-white/95 backdrop-blur-sm shadow-md pl-2 pr-6 xl:pr-10 flex items-center">
          <ul class="flex items-center gap-1.5 xl:gap-2.5 h-full text-[#0B2545] text-[11px] xl:text-xs font-semibold">
            <li v-for="(link, index) in navLinks" :key="link.path" class="h-full flex items-center">
              <NuxtLink 
                :to="link.path" 
                class="h-full flex items-center px-2 hover:text-[#01ACF2] transition-colors relative"
                :class="{ 'text-[#01ACF2] font-bold': $route.path === link.path }"
              >
                {{ link.label }}
                <svg v-if="link.hasDropdown" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 ml-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                </svg>
                <!-- Active Underline Indicator (እንደ ፎቶው ከታች የሚመጣ መስመር) -->
                <span v-if="$route.path === link.path" class="absolute bottom-0 left-2 right-2 h-[2.5px] bg-amber-500 rounded-t"></span>
              </NuxtLink>

              <!-- Subtle Divider Lines -->
              <span v-if="index !== navLinks.length - 1" class="text-gray-300 text-[10px] ml-1 xl:ml-1.5 select-none opacity-60">|</span>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <!-- ==================== MOBILE HEADER ==================== -->
    <div class="lg:hidden bg-gradient-to-r from-[#006ea6] to-[#01ACF2] px-4 py-2 flex items-center justify-between shadow-md">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <div class="w-9 h-9 bg-white rotate-45 overflow-hidden flex items-center justify-center shadow">
          <img src="~/assets/images/maus.jpg" class="w-[140%] h-[140%] -rotate-45 object-contain" alt="MAU Logo" />
        </div>
        <div>
          <span class="block text-white font-serif font-bold text-sm leading-tight">Mekdela Amba</span>
          <span class="block text-amber-300 font-serif text-[10px]">ዩኒቨርሲቲ</span>
        </div>
      </NuxtLink>

      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="p-1.5 rounded-md text-white hover:bg-white/10 transition-colors">
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
=======
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
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
    </div>

    <!-- MOBILE MENU CONTENT -->
    <transition name="mobile-menu">
<<<<<<< HEAD
      <div v-if="isMobileMenuOpen" class="lg:hidden bg-[#f4fbff] shadow-xl border-t border-blue-100">
        <div class="p-3 border-b border-blue-100">
          <input type="text" placeholder="Search..." class="w-full px-3 py-1.5 text-xs border border-blue-200 rounded-md bg-white focus:outline-none focus:border-[#01ACF2]" />
        </div>
        <div class="p-2 divide-y divide-gray-100">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            @click="isMobileMenuOpen = false"
            class="block px-3 py-2 text-xs text-[#0B2545] font-semibold hover:bg-white rounded transition-colors"
          >
=======
      <div v-if="isMobileMenuOpen" class="lg:hidden absolute top-full left-0 w-full bg-[#EAF9FF] shadow-xl z-50">
        <div class="p-4 border-b border-gray-100">
          <input type="text" placeholder="Search..." class="w-full px-4 py-2 border border-[#01ACF2] rounded-md bg-white/80" />
        </div>
        <div class="p-2">
          <NuxtLink v-for="link in navLinks" :key="link.path" :to="link.path" @click="isMobileMenuOpen = false"
            class="block px-4 py-3 text-[#0B2545] font-bold border-b border-gray-100 hover:bg-white/60">
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </transition>
    
  </header>
</template>

<script setup>
import { ref } from 'vue'
<<<<<<< HEAD

=======
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
const isMobileMenuOpen = ref(false)

const navLinks = [
  { path: '/', label: 'Home', hasDropdown: false },
  { path: '/about', label: 'About', hasDropdown: true },
  { path: '/academics', label: 'Academics', hasDropdown: true },
<<<<<<< HEAD
  { path: '/research', label: 'Research', hasDropdown: true },
  { path: '/search', label: 'Search books', hasDropdown: true },
  { path: '/portal', label: 'Student Portal', hasDropdown: false },
  { path: '/contact', label: 'Contact', hasDropdown: false },
=======
  { path: '/search', label: 'search books', hasDropdown: true },
  { path: '/research', label: 'Research', hasDropdown: true },
  { path: '/auth', label: 'Student Portal', hasDropdown: false },
  { path: '/contact', label: 'Contact', hasDropdown: false },
  { path: '/auth', label: 'Login', hasDropdown: false },
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
]
</script>

<style scoped>
.mobile-menu-enter-active, .mobile-menu-leave-active {
<<<<<<< HEAD
  transition: all 0.25s ease-in-out;
  max-height: 400px;
=======
  transition: all 0.3s ease;
  max-height: 500px;
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
  overflow: hidden;
}
.mobile-menu-enter-from, .mobile-menu-leave-to {
  max-height: 0;
<<<<<<< HEAD
  opacity: 0;
=======
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
}
</style>