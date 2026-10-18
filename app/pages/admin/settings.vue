<template>
  <div class="max-w-4xl space-y-6">
    
    <div>
      <h1 class="text-2xl font-black text-white">የሲስተም መቼቶች (System Settings)</h1>
      <p class="text-xs text-slate-400 mt-1">የፕላትፎርሙን አጠቃላይ ህጎች፣ የኮሚሽን መጠን እና ኤፒአይ መቼቶች ያስተካክሉ።</p>
    </div>

    <!-- TABS -->
    <div class="flex gap-2 border-b border-slate-800 pb-2">
      <button
        @click="activeTab = 'general'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
        :class="activeTab === 'general' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'"
      >
        ⚙️ አጠቃላይ መቼቶች
      </button>

      <button
        @click="activeTab = 'payment'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
        :class="activeTab === 'payment' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'"
      >
        💳 ክፍያና ኮሚሽን (Finance)
      </button>

      <button
        @click="activeTab = 'security'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
        :class="activeTab === 'security' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'"
      >
        🔒 የአድሚን ደህንነት
      </button>
    </div>

    <!-- TAB 1: GENERAL SETTINGS -->
    <div v-if="activeTab === 'general'" class="bg-[#0b1320] border border-slate-800 rounded-2xl p-6 space-y-4">
      <h2 class="text-sm font-bold text-emerald-400 border-b border-slate-800 pb-3">የሲስተም መረጃ</h2>
      
      <form @submit.prevent="saveSettings" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">የፕላትፎርም ስም</label>
            <input v-model="settings.appName" type="text" class="w-full bg-[#070c14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">የእርዳታ መስመር (Support Phone)</label>
            <input v-model="settings.supportPhone" type="text" class="w-full bg-[#070c14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">የእርዳታ ኢሜይል (Support Email)</label>
          <input v-model="settings.supportEmail" type="email" class="w-full bg-[#070c14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
        </div>

        <div class="flex justify-end pt-2">
          <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition">
            ለውጦችን መዝግብ
          </button>
        </div>
      </form>
    </div>

    <!-- TAB 2: PAYMENTS & COMMISSION -->
    <div v-if="activeTab === 'payment'" class="bg-[#0b1320] border border-slate-800 rounded-2xl p-6 space-y-4">
      <h2 class="text-sm font-bold text-emerald-400 border-b border-slate-800 pb-3">የኮሚሽንና የክፍያ መቼቶች</h2>
      
      <form @submit.prevent="saveSettings" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">የሲስተም ኮሚሽን (%)</label>
            <input v-model="settings.commissionRate" type="number" class="w-full bg-[#070c14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
            <span class="text-[10px] text-slate-500 mt-1 block">ከእያንዳንዱ ቡኪንግ ለአድሚን የሚቀረው %.</span>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">Chapa / Telebirr API Key</label>
            <input v-model="settings.apiKey" type="password" class="w-full bg-[#070c14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition">
            የክፍያ መቼቶችን አስቀምጥ
          </button>
        </div>
      </form>
    </div>

    <!-- TAB 3: SECURITY -->
    <div v-if="activeTab === 'security'" class="bg-[#0b1320] border border-slate-800 rounded-2xl p-6 space-y-4">
      <h2 class="text-sm font-bold text-emerald-400 border-b border-slate-800 pb-3">የአድሚን ይለፍ ቃል መቀየሪያ</h2>
      
      <form @submit.prevent="saveSettings" class="space-y-4 max-w-md">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">የአሁኑ ፓስወርድ</label>
          <input type="password" placeholder="••••••••" class="w-full bg-[#070c14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">አዲስ ፓስወርድ</label>
          <input type="password" placeholder="••••••••" class="w-full bg-[#070c14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
        </div>

        <div class="pt-2">
          <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition">
            ፓስወርድ ቀይር
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  layout: 'admin',
  middleware: 'auth' // ሎግ-ኢን ያላደረገ እንዳይገባ
})

const activeTab = ref('general')

const settings = ref({
  appName: 'EthioSport Portal',
  supportPhone: '+251 911 000 000',
  supportEmail: 'admin@ethiosport.et',
  commissionRate: 10,
  apiKey: 'chapa_secret_key_123456789'
})

const saveSettings = () => {
  alert('መቼቶቹ በትክክል ተቀምጠዋል!')
}
</script>