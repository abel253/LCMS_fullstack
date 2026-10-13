<template>
  <footer class="bg-[#01ACF2] text-[#0B2545] mt-auto">
    <div class="container-custom py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-gold-500/30 flex items-center justify-center border-2 border-gold-400/50">
              <div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <span class="text-gold-400 font-black text-sm">MAU</span>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#0B2545] leading-tight">Mekdela Amba University</h3>
              <span class="text-sm text-[#0B2545]/80">መቅደላ አምባ ዩኒቨርሲቲ</span>
            </div>
          </div>
          <p class="text-[#0B2545]/85 text-sm leading-relaxed mt-3">
            Nurturing competent graduates, generating impactful research, and serving society for a brighter tomorrow.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-base font-semibold mb-4 text-[#0B2545]">Quick Links</h4>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <NuxtLink v-for="link in quickLinks" :key="link.path" :to="link.path"
              class="text-[#0B2545]/80 hover:text-[#ffffff] text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Contact Information -->
        <div>
          <h4 class="text-base font-semibold mb-4 text-[#0B2545]">Contact Information</h4>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start gap-2 text-[#0B2545]/85">
              <span class="mt-0.5">📍</span>
              <span>Mekdela, Ethiopia</span>
            </li>
            <li class="flex items-start gap-2 text-[#0B2545]/85">
              <span class="mt-0.5">📞</span>
              <span>+251 123 456 789</span>
            </li>
            <li class="flex items-start gap-2 text-[#0B2545]/85">
              <span class="mt-0.5">✉️</span>
              <a href="mailto:info@mau.edu.et" class="hover:text-white transition-colors">info@mau.edu.et</a>
            </li>
            <li class="flex items-start gap-2 text-[#0B2545]/85">
              <span class="mt-0.5">🌐</span>
              <a href="#" class="hover:text-white transition-colors">www.mau.edu.et</a>
            </li>
          </ul>
        </div>

        <!-- Follow Us -->
        <div>
          <h4 class="text-base font-semibold mb-4 text-[#0B2545]">Follow Us</h4>
          <div class="flex items-center gap-3">
            <!-- Facebook -->
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <!-- X/Twitter -->
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <!-- YouTube -->
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <!-- LinkedIn -->
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bg-[#0197d8] border-t border-white/20">
      <div class="container-custom py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2 text-xs text-[#EAF9FF]">
          <span>© {{ new Date().getFullYear() }} Mekdela Amba University. All Rights Reserved.</span>
          <span class="hidden md:inline text-[#EAF9FF]">|</span>
          <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
          <span>|</span>
          <a href="#" class="hover:text-white transition-colors">Terms of Use</a>
          <span>|</span>
          <a href="#" class="hover:text-white transition-colors">Sitemap</a>
        </div>
        <p class="text-sm italic text-[#EAF9FF] font-medium">"Knowledge for a better society"</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const quickLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/search', label: 'Academics' },
  { path: '/search', label: 'Admissions' },
  { path: '/research', label: 'Research' },
  { path: '/search', label: 'Library' },
  { path: '/auth/login', label: 'Student Portal' },
  { path: '/about', label: 'Contact' }
]
</script>