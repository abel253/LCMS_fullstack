<template>
  <div>
    <div class="flex justify-between items-center mb-8 border-b pb-4">
      <h2 class="text-3xl font-bold text-[#1B3A5C]">Latest News & Events</h2>
      <NuxtLink to="/news" class="text-[#2C5282] hover:text-[#1B3A5C] font-semibold flex items-center transition-colors">
        View All News <span class="ml-1">&rarr;</span>
      </NuxtLink>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
        <div class="h-40 bg-gray-200 relative overflow-hidden">
          <div class="absolute inset-0 bg-[#1B3A5C]/10 group-hover:bg-transparent transition-colors"></div>
          <div class="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        </div>
        <div class="flex flex-1 p-4">
          <div class="flex-shrink-0 mr-4">
            <div class="bg-gray-100 text-center rounded-md overflow-hidden border border-gray-200 w-14">
              <div class="bg-[#1B3A5C] text-white text-[10px] font-bold uppercase py-1">Oct</div>
              <div class="text-xl font-bold text-gray-800 py-1">15</div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <h3 class="text-lg font-bold text-[#1B3A5C] mb-2 leading-tight group-hover:text-[#2C5282] transition-colors">
              University Convocation Ceremony 2024
            </h3>
            <p class="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
              Join us in celebrating the achievements of our graduating class. The ceremony will be held at the main campus stadium.
            </p>
            <NuxtLink to="/news/convocation-2024" class="text-sm text-[#C8A415] hover:text-[#B8941A] font-medium flex items-center mt-auto">
              Read More <span class="ml-1">&rarr;</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
        <div class="h-40 bg-gray-200 relative overflow-hidden">
          <div class="absolute inset-0 bg-[#1B3A5C]/10 group-hover:bg-transparent transition-colors"></div>
          <div class="absolute inset-0 flex items-center justify-center text-gray-400">
             <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path></svg>
          </div>
        </div>
        <div class="flex flex-1 p-4">
          <div class="flex-shrink-0 mr-4">
            <div class="bg-gray-100 text-center rounded-md overflow-hidden border border-gray-200 w-14">
              <div class="bg-[#1B3A5C] text-white text-[10px] font-bold uppercase py-1">Nov</div>
              <div class="text-xl font-bold text-gray-800 py-1">02</div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <h3 class="text-lg font-bold text-[#1B3A5C] mb-2 leading-tight group-hover:text-[#2C5282] transition-colors">
              New Research Grant Opportunities
            </h3>
            <p class="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
              The Ministry of Education has announced new research grants for faculty members in STEM fields. Apply by November end.
            </p>
            <NuxtLink to="/news/research-grants" class="text-sm text-[#C8A415] hover:text-[#B8941A] font-medium flex items-center mt-auto">
              Read More <span class="ml-1">&rarr;</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
        <div class="h-40 bg-gray-200 relative overflow-hidden">
          <div class="absolute inset-0 bg-[#1B3A5C]/10 group-hover:bg-transparent transition-colors"></div>
          <div class="absolute inset-0 flex items-center justify-center text-gray-400">
             <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
        </div>
        <div class="flex flex-1 p-4">
          <div class="flex-shrink-0 mr-4">
            <div class="bg-gray-100 text-center rounded-md overflow-hidden border border-gray-200 w-14">
              <div class="bg-[#1B3A5C] text-white text-[10px] font-bold uppercase py-1">Nov</div>
              <div class="text-xl font-bold text-gray-800 py-1">10</div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <h3 class="text-lg font-bold text-[#1B3A5C] mb-2 leading-tight group-hover:text-[#2C5282] transition-colors">
              Annual Inter-Faculty Sports Meet
            </h3>
            <p class="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
              Get ready for a week of competitive sports and activities. Students are encouraged to register their teams early.
            </p>
            <NuxtLink to="/news/sports-meet" class="text-sm text-[#C8A415] hover:text-[#B8941A] font-medium flex items-center mt-auto">
              Read More <span class="ml-1">&rarr;</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
