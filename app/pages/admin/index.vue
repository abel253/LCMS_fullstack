<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-black text-gray-900 dark:text-white">የአድሚን ማጠቃለያ</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">አጠቃላይ የሲስተሙ እንቅስቃሴ</p>
      </div>
      <div class="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800">
        ዛሬ: {{ new Date().toLocaleDateString('et-ET') }}
      </div>
    </div>

    <!-- STATS CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Revenue -->
      <div class="bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm hover:border-green-500/50 transition-colors">
        <div class="flex justify-between items-start mb-4">
           <span class="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">አጠቃላይ ገቢ</span>
           <Icon name="lucide:banknote" class="w-5 h-5 text-green-500" />
        </div>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white">
          1.2M <span class="text-xs text-slate-500">ETB</span>
        </h2>
        <div class="mt-2 text-[10px] text-green-600 font-bold">+12% ካለፈው ወር</div>
      </div>

      <!-- Partners -->
      <div class="bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <span class="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase">ፓርትነሮች</span>
          <Icon name="lucide:users" class="w-5 h-5 text-blue-500" />
        </div>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white">124</h2>
        <div class="mt-2 text-[10px] text-blue-600 font-bold">+5 አዲስ</div>
      </div>

      <!-- Total Users -->
      <div class="bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <span class="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase">ተጠቃሚዎች</span>
          <Icon name="lucide:user-check" class="w-5 h-5 text-emerald-500" />
        </div>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white">15.4K</h2>
      </div>

      <!-- Complaints -->
      <div class="bg-white dark:bg-[#0b1320] p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <span class="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase">ቅሬታዎች</span>
          <Icon name="lucide:alert-circle" class="w-5 h-5 text-rose-500" />
        </div>
        <h2 class="text-3xl font-black text-rose-500">5</h2>
        <div class="mt-2 text-[10px] text-rose-400 font-bold">አስቸኳይ</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  layout: 'admin',
  middleware: 'auth' // ሎግ-ኢን ያላደረገ እንዳይገባ
})
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Admin ካልሆነ ወደ መነሻ ይሂድ
onMounted(() => {
  if (authStore.user?.role !== 'admin') {
    router.push('/')
  }
})
</script>