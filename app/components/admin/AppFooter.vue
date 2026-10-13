<!-- components/AdminFooter.vue -->
<template>
  <footer class="w-full bg-[#0b111a] border-t border-[#212e3e] py-4 px-6 text-slate-400 text-xs shrink-0 font-sans mt-auto">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
      
      <!-- BRAND & COPYRIGHT -->
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center text-slate-950 font-black text-[10px]">
          E
        </div>
        <p class="font-medium text-slate-400">
          © 2026 <span class="text-white font-bold tracking-wide">ETHIO-<span class="text-emerald-500">SPORT</span></span> Admin Panel. All Rights Reserved.
        </p>
      </div>

      <!-- SYSTEM STATUS & LINKS -->
      <div class="flex items-center gap-6 text-[11px] font-medium">
        <!-- Live System Indicator -->
        <div class="flex items-center gap-2 bg-[#131c27] px-2.5 py-1 rounded-full border border-[#212e3e]">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-slate-300 font-semibold">System Online</span>
        </div>

        <!-- Quick Links -->
        <div class="flex items-center gap-4 text-slate-400">
          <NuxtLink to="/admin/settings" class="hover:text-emerald-400 transition">Settings</NuxtLink>
          <span>•</span>
          <a href="#" class="hover:text-emerald-400 transition">Privacy Policy</a>
          <span>•</span>
          <a href="#" class="hover:text-emerald-400 transition">Support</a>
        </div>
      </div>

    </div>
  </footer>
</template>