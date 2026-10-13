<script setup>
const stats = [
  { icon: '👥', number: '12,580', label: 'Students' },
  { icon: '🏛️', number: '6', label: 'Faculties' },
  { icon: '🔬', number: '120+', label: 'Research Projects' },
  { icon: '💻', number: '50,000+', label: 'Digital Resources' },
  { icon: '👩‍🏫', number: '800+', label: 'Academic & Admin Staff' },
  { icon: '🏢', number: 'Modern', label: 'Campus Facilities' },
]
</script>

<template>
  <div class="bg-white shadow-md w-full relative z-20 -mt-10 max-w-7xl mx-auto rounded-lg overflow-hidden">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="p-6 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg bg-white"
      >
        <span class="text-4xl mb-3 text-[#2C5282]">{{ stat.icon }}</span>
        <h3 class="text-2xl font-bold text-[#1B3A5C] mb-1">{{ stat.number }}</h3>
        <p class="text-xs sm:text-sm font-medium text-[#4A5568] uppercase tracking-wider">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>
