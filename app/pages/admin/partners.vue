<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-white">የፓርትነሮች (ሜዳዎች) ዝርዝር</h1>
        <p class="text-xs text-slate-400 mt-1">በሲስተሙ የተመዘገቡና ማፅደቅ የሚጠብቁ ሜዳዎች</p>
      </div>
      <button class="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-500 transition">
        + አዲስ ሜዳ መዝግብ
      </button>
    </div>

    <!-- PARTNERS TABLE -->
    <div class="bg-[#0b1320] border border-slate-800 rounded-2xl overflow-hidden">
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="bg-[#070c14] border-b border-slate-800 text-slate-400 uppercase font-bold">
          <tr>
            <th class="p-4">የሜዳ ስም</th>
            <th class="p-4">ባለቤት</th>
            <th class="p-4">አድራሻ</th>
            <th class="p-4">ሁኔታ (Status)</th>
            <th class="p-4 text-right">ድርጊት</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          <tr v-for="p in partners" :key="p.id" class="hover:bg-slate-800/30">
            <td class="p-4 font-bold text-white">{{ p.name }}</td>
            <td class="p-4">{{ p.owner }}</td>
            <td class="p-4">{{ p.location }}</td>
            <td class="p-4">
              <span :class="p.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'" class="px-2.5 py-1 rounded-full text-[10px] font-bold border">
                {{ p.active ? 'የፀደቀ' : 'በይግባኝ ላይ' }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button class="text-slate-400 hover:text-white font-semibold">ዝርዝር</button>
              <button class="text-rose-400 hover:text-rose-300 font-semibold">እገድ (Ban)</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const partners = [
  { id: 1, name: 'ቦሌ ፉትሳል ማዕከል', owner: 'አቶ ዳዊት አበበ', location: 'አዲስ አበባ፣ ቦሌ', active: true },
  { id: 2, name: 'ካዛንችስ ስፖርት ዞን', owner: 'አቶ ዮናስ ተስፋዬ', location: 'አዲስ አበባ፣ ካዛንችስ', active: false },
  { id: 3, name: 'መስቀል ፍሬንድሺፕ ሜዳ', owner: 'ወ/ሮ ሳራ ከበደ', location: 'አዲስ አበባ፣ መስቀል አደባባይ', active: true }
]
</script>