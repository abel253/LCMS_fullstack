<script setup>
const faculties = [
  {
    name: 'Engineering',
    description: 'Fostering innovation through advanced engineering principles and practical applications.',
    icon: '⚙️',
  },
  {
    name: 'Natural & Computational Sciences',
    description: 'Exploring the fundamental laws of nature and the power of computational algorithms.',
    icon: '🧬',
  },
  {
    name: 'Social Sciences & Humanities',
    description: 'Understanding human society, culture, and history to build a better tomorrow.',
    icon: '🏛️',
  },
  {
    name: 'Business & Economics',
    description: 'Developing future business leaders and economists with global perspectives.',
    icon: '📈',
  },
  {
    name: 'Agriculture & Environmental Sciences',
    description: 'Promoting sustainable agriculture and environmental stewardship for our planet.',
    icon: '🌱',
  },
  {
    name: 'Health Sciences',
    description: 'Advancing healthcare through rigorous training, research, and clinical practice.',
    icon: '⚕️',
  },
]
</script>

<template>
  <section class="py-16 bg-[#F5F7FA]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-[#1B3A5C] mb-3">Our Faculties</h2>
          <div class="h-1 w-24 bg-[#C8A415]"></div>
        </div>
        <a href="#" class="mt-4 md:mt-0 text-[#2C5282] hover:text-[#1B3A5C] font-semibold flex items-center gap-1 transition-colors">
          View All Faculties <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="faculty in faculties" 
          :key="faculty.name"
          class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col"
        >
          <!-- Top image strip placeholder -->
          <div class="h-32 bg-gradient-to-r from-[#1B3A5C] to-[#2C5282] relative">
            <!-- Circular icon overlapping -->
            <div class="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md text-3xl border-4 border-white group-hover:scale-110 transition-transform">
              {{ faculty.icon }}
            </div>
          </div>
          
          <div class="pt-12 pb-6 px-6 flex-grow flex flex-col">
            <h3 class="text-xl font-bold text-[#1B3A5C] mb-3 group-hover:text-[#2C5282] transition-colors">
              {{ faculty.name }}
            </h3>
            <p class="text-[#4A5568] mb-6 flex-grow text-sm leading-relaxed">
              {{ faculty.description }}
            </p>
            <a href="#" class="inline-flex items-center text-[#C8A415] font-semibold hover:text-[#B8941A] transition-colors text-sm">
              Learn More <span class="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
