<template>
  <div class="bg-[#EAF9FF] text-[#12334D]">
    <section class="about-hero relative flex min-h-[300px] items-center overflow-hidden sm:min-h-[340px] lg:min-h-[390px]">
      <div class="absolute inset-0 bg-gradient-to-r from-[#062C4B]/95 via-[#063B61]/80 to-[#063B61]/20"></div>
      <div class="container-custom relative z-10 py-10 sm:py-12">
        <div class="max-w-2xl">
          <p class="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#FFD166] sm:text-sm">
            Mekdela Amba University
          </p>
          <h1 class="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            About <span class="text-[#FFD166]">Mekdela Amba University</span>
          </h1>
          <h2 class="mt-3 text-base font-bold leading-snug text-[#FFD166] sm:text-lg lg:text-xl">
            Excellence in Education, Research, Innovation and Service to Society
          </h2>
          <p class="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
            We are a center of academic excellence, committed to nurturing competent graduates,
            advancing impactful research, and serving society for a brighter, more prosperous Ethiopia.
          </p>
          <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            <NuxtLink
              to="/search"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFD166] px-5 py-2.5 text-sm font-bold text-[#12334D] shadow-lg transition hover:bg-[#FFE19A] sm:w-auto"
            >
              Explore the Library <span aria-hidden="true">→</span>
            </NuxtLink>
            <NuxtLink
              to="/research"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/80 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#12334D] sm:w-auto"
            >
              Discover Our Research <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
      <p class="absolute bottom-5 right-6 z-10 hidden font-serif text-lg italic text-white/90 md:block">
        Brighter Minds, Stronger Ethiopia
      </p>
    </section>

    <section class="container-custom py-9 sm:py-11 lg:py-12">
      <div class="grid items-center gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
        <div>
          <div class="mb-2 flex items-center gap-2">
            <span class="h-1 w-8 rounded-full bg-[#01ACF2]"></span>
            <span class="text-xs font-bold uppercase tracking-widest text-[#1478A5]">Who We Are</span>
          </div>
          <h2 class="font-serif text-2xl font-bold text-[#103B5C] sm:text-3xl">
            University <span class="text-[#01ACF2]">Overview</span>
          </h2>
          <p class="mt-3 text-sm leading-relaxed text-[#36566D] sm:text-base">
            Mekdela Amba University is dedicated to expanding access to quality higher education and
            contributing to sustainable development in Ethiopia. Through excellent teaching,
            meaningful research, and strong community partnerships, we prepare graduates to make a
            positive difference.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-[#36566D] sm:text-base">
            Our university community values knowledge, innovation, integrity, and service. We continue
            to grow our academic programs and learning resources to meet the needs of students and society.
          </p>
          <NuxtLink
            to="/"
            class="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#01ACF2] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#078BC3]"
          >
            Learn More About MAU <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
        <div class="relative">
          <img
            :src="campusImage"
            alt="Students studying in the Mekdela Amba University library"
            class="h-56 w-full rounded-xl object-cover shadow-xl sm:h-72 lg:h-[340px]"
          />
          <div class="absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-2xl border-4 border-[#01ACF2] bg-white/80 lg:block"></div>
        </div>
      </div>
    </section>

    <section class="border-y border-[#C8EAF8] bg-white/70 py-9 sm:py-11">
      <div class="container-custom">
        <div class="mb-6 text-center sm:mb-7">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#1478A5]">Our Purpose</p>
          <h2 class="mt-2 font-serif text-2xl font-bold text-[#103B5C] sm:text-3xl">
            What Guides <span class="text-[#01ACF2]">Us</span>
          </h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="item in purposeCards"
            :key="item.title"
            class="rounded-xl border-t-4 border-[#01ACF2] border-x border-b border-[#C8EAF8] bg-[#F5FCFF] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
          >
            <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#01ACF2] text-xl text-white sm:h-12 sm:w-12">
              {{ item.icon }}
            </div>
            <h3 class="font-serif text-lg font-bold text-[#103B5C]">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-[#45647A]">{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="container-custom py-9 sm:py-11">
      <div class="grid gap-5 rounded-xl bg-[#0B3D60] p-5 text-white shadow-xl sm:p-7 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#7DDBFF] sm:text-sm">Learn, discover, contribute</p>
          <h2 class="mt-2 font-serif text-xl font-bold sm:text-2xl">
            Be part of a community shaping a brighter future.
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Explore the resources, research, and learning opportunities available through Mekdela Amba University.
          </p>
        </div>
        <NuxtLink
          to="/search"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFD166] px-5 py-2.5 text-sm font-bold text-[#12334D] transition hover:bg-[#FFE19A] md:whitespace-nowrap"
        >
          Explore Resources <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import campusImage from '~/assets/images/library11.jpg'

const purposeCards = [
  {
    title: 'Our Mission',
    icon: '◎',
    description:
      'To provide quality education, generate impactful research, and serve society through innovation, community engagement, and sustainable development.'
  },
  {
    title: 'Our Vision',
    icon: '◉',
    description:
      'To be a nationally and internationally recognized university for excellence in education, research, innovation, and community service.'
  },
  {
    title: 'Our Core Values',
    icon: '◇',
    description:
      'Academic excellence, integrity, innovation, service to society, diversity and inclusion, and accountability guide our work.'
  }
]
</script>

<style scoped>
.about-hero {
  background-image: url('~/assets/images/library2.avif');
  background-position: center;
  background-size: cover;
}
</style>
