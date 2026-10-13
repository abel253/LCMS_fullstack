<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-white">ሪፖርቶችና የተጠቃሚ ቅሬታዎች</h1>
        <p class="text-xs text-slate-400 mt-1">ከተጠቃሚዎችና ከሜዳ ባለቤቶች የቀረቡ አቤቱታዎች</p>
      </div>
      <span class="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-xl text-xs font-bold">
        5 ያልተመለሱ
      </span>
    </div>

    <div class="space-y-3">
      <div v-for="r in reports" :key="r.id" class="bg-[#0b1320] border border-slate-800 p-4 rounded-2xl space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-rose-400">{{ r.type }}</span>
          <span class="text-[10px] text-slate-500">{{ r.time }}</span>
        </div>
        <p class="text-xs text-slate-200">{{ r.message }}</p>
        <div class="text-[11px] text-slate-400 pt-1">አቅራቢ: {{ r.from }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const reports = [
  { id: 1, type: 'የክፍያ ችግር', message: 'ክፍያ ፈፅሜ ቡኪንግ አልተረጋገጠልኝም።', from: 'አበበ በቀለ', time: 'ከ10 ደቂቃ በፊት' },
  { id: 2, type: 'የሜዳ ጥራት ቅሬታ', message: 'የተያዘው ሰዓት ላይ ሌላ ቡድን እየተጫወተበት ነበር።', from: 'ዮናስ', time: 'ከ1 ሰዓት በፊት' }
]
</script>