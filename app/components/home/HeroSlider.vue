<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  {
    image: 'library12.jpg',
  },
  {
    image: 'library2.avif',
  },
  {
    image: 'library12.jpg',
  }
]

const currentIndex = ref(0)
let timer = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
}

onMounted(() => {
  timer = setInterval(nextSlide, 6000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-[#1B3A5C]">
    <div 
      v-for="(slide, index) in slides" 
      :key="index"
      class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
      :class="index === currentIndex ? 'opacity-100' : 'opacity-0'"
    >
      <img :src="`~/assets/images/${slide.image}`" class="w-full h-full object-cover object-center" alt="Campus View" />
      <div class="absolute inset-0 bg-black/60"></div>
    </div>

    <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 md:px-8">
      <div class="absolute top-8 right-8 hidden md:block">
        <span class="font-serif italic text-2xl text-[#C8A415] opacity-90">Brighter Minds Stronger Ethiopia</span>
      </div>

      <p class="text-sm md:text-base font-semibold tracking-widest uppercase mb-4 text-[#D4AF37]">Welcome To</p>
      <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">Mekdela Amba University</h1>
      <p class="text-xl md:text-2xl font-medium mb-4 text-gray-200">Excellence in Education, Research and Innovation</p>
      <p class="max-w-2xl text-base md:text-lg text-gray-300 mb-10">
        Empowering the next generation of leaders through cutting-edge research, comprehensive education, and a commitment to societal impact. Join us in shaping a brighter future.
      </p>

      <div class="flex flex-col sm:flex-row gap-4">
        <button class="bg-[#C8A415] hover:bg-[#B8941A] text-white px-8 py-3 rounded font-semibold transition-colors shadow-lg">
          Apply Now &rarr;
        </button>
        <button class="bg-transparent border-2 border-white hover:bg-white hover:text-[#1B3A5C] text-white px-8 py-3 rounded font-semibold transition-colors shadow-lg">
          Explore Programs &rarr;
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <button 
      @click="prevSlide" 
      class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all z-10"
    >
      &#9664;
    </button>
    <button 
      @click="nextSlide" 
      class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all z-10"
    >
      &#9654;
    </button>
  </div>
</template>
