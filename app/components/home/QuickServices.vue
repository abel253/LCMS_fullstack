<template>
  <div>
    <div class="flex justify-between items-center mb-8 border-b pb-4">
      <h2 class="text-2xl font-bold text-[#1B3A5C]">Quick Services</h2>
      <NuxtLink to="/services" class="text-sm text-[#2C5282] hover:text-[#1B3A5C] font-semibold transition-colors flex items-center">
        All Services <span class="ml-1">&rarr;</span>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
      <NuxtLink v-for="(service, index) in services" :key="index" :to="service.link" class="flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-[#3B6BA5] transition-all group">
        <div :class="`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${service.bgColor}`">
          <svg class="w-5 h-5" :class="service.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="service.icon"></svg>
        </div>
        <span class="font-medium text-gray-700 group-hover:text-[#1B3A5C] transition-colors">{{ service.name }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const services = [
  {
    name: 'Student Portal Login',
    link: '/portal',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>'
  },
  {
    name: 'E-Learning (MOODLE)',
    link: '/e-learning',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>'
  },
  {
    name: 'Digital Library Search',
    link: '/library',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>'
  },
  {
    name: 'Admissions',
    link: '/admissions',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
  },
  {
    name: 'Research Portal',
    link: '/research',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>'
  },
  {
    name: 'Announcements',
    link: '/announcements',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>'
  },
  {
    name: 'Academic Calendar',
    link: '/calendar',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>'
  },
  {
    name: 'Contact Us',
    link: '/contact',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>'
  }
]
</script>
