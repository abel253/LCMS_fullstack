<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-white">ፋይናንስ እና የክፍያ ጥያቄዎች (Payouts)</h1>
      <p class="text-xs text-slate-400 mt-1">ለሜዳ ባለቤቶች የሚተላለፉ ገቢዎችና የኮሚሽን ስታቲስቲክስ</p>
    </div>

    <div class="bg-[#0b1320] border border-slate-800 rounded-2xl p-5 space-y-4">
      <h2 class="text-sm font-bold text-emerald-400 border-b border-slate-800 pb-3">በቅርብ የተጠየቁ ክፍያዎች</h2>
      <div class="space-y-3">
        <div v-for="p in payouts" :key="p.id" class="flex items-center justify-between bg-[#070c14] p-3 rounded-xl border border-slate-800/80">
          <div>
            <p class="text-xs font-bold text-white">{{ p.venue }}</p>
            <p class="text-[10px] text-slate-400">{{ p.bank }} - {{ p.account }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold text-emerald-400">{{ p.amount }} ETB</p>
            <button class="text-[10px] bg-emerald-600 text-white px-2.5 py-1 rounded-lg mt-1 font-bold">ክፍያ ፈፅም</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const payouts = [
  { id: 1, venue: 'ቦሌ ፉትሳል', bank: 'CBE', account: '100012345678', amount: '24,500' },
  { id: 2, venue: 'ካዛንችስ ስፖርት', bank: 'Abyssinia', account: '987654321', amount: '18,000' }
]
</script>