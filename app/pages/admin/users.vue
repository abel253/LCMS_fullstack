<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-white">የተጠቃሚዎች አስተዳደር</h1>
      <p class="text-xs text-slate-400 mt-1">በመተግበሪያው የተመዘገቡ ተጫዋቾችና ደንበኞች</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="u in users" :key="u.id" class="bg-[#0b1320] border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-emerald-400">
            {{ u.name[0] }}
          </div>
          <div>
            <h3 class="text-xs font-bold text-white">{{ u.name }}</h3>
            <p class="text-[11px] text-slate-400">{{ u.phone }}</p>
          </div>
        </div>
        <span class="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-lg">{{ u.bookings }} ቡኪንግ</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const users = [
  { id: 1, name: 'አበበ በቀለ', phone: '0911223344', bookings: 12 },
  { id: 2, name: 'ኬብሮን ሰለሞን', phone: '0922334455', bookings: 5 },
  { id: 3, name: 'ናታን ግርማ', phone: '0933445566', bookings: 24 }
]
</script>