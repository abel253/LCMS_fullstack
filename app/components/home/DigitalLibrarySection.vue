<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Side -->
        <div>
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-[#1B3A5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-[#1B3A5C]">
              Digital Library & MAU - Library Circulation System (MAU-LCS)
            </h2>
          </div>
          
          <p class="text-gray-600 mb-8 leading-relaxed">
            Access our comprehensive collection of digital resources, books, and journals anytime, anywhere. Our web-based self-service platform provides 24/7 access to the university's academic wealth, streamlining borrowing and research for students and faculty.
          </p>
          
          <div class="flex flex-wrap gap-4 mb-10">
            <NuxtLink to="/library" class="px-6 py-3 bg-[#1B3A5C] text-white rounded-md hover:bg-[#2C5282] transition-colors font-medium flex items-center">
              Access Digital Library <span class="ml-2">&rarr;</span>
            </NuxtLink>
            <NuxtLink to="/about-lcs" class="px-6 py-3 bg-white text-[#1B3A5C] border border-[#1B3A5C] rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center">
              Learn More <span class="ml-2">&rarr;</span>
            </NuxtLink>
          </div>
          
          <!-- Mockup -->
          <div class="relative bg-white rounded-lg shadow-xl p-4 border border-gray-100 overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-8 bg-gray-100 flex items-center px-4 space-x-2 rounded-t-lg">
              <div class="w-3 h-3 rounded-full bg-red-400"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div class="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div class="pt-8">
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="h-16 bg-blue-50 rounded p-2 flex flex-col justify-center">
                  <div class="text-xs text-gray-500 mb-1">Total Books</div>
                  <div class="text-lg font-bold text-[#1B3A5C]">12,450</div>
                </div>
                <div class="h-16 bg-green-50 rounded p-2 flex flex-col justify-center">
                  <div class="text-xs text-gray-500 mb-1">Active Loans</div>
                  <div class="text-lg font-bold text-green-700">842</div>
                </div>
                <div class="h-16 bg-purple-50 rounded p-2 flex flex-col justify-center">
                  <div class="text-xs text-gray-500 mb-1">New Arrivals</div>
                  <div class="text-lg font-bold text-purple-700">156</div>
                </div>
              </div>
              <div class="h-32 bg-gray-50 rounded border border-gray-100 flex items-end px-4 pb-2 space-x-2">
                <div class="w-1/6 bg-blue-200 h-1/2 rounded-t"></div>
                <div class="w-1/6 bg-blue-300 h-3/4 rounded-t"></div>
                <div class="w-1/6 bg-blue-400 h-full rounded-t"></div>
                <div class="w-1/6 bg-blue-300 h-2/3 rounded-t"></div>
                <div class="w-1/6 bg-blue-200 h-1/3 rounded-t"></div>
                <div class="w-1/6 bg-blue-100 h-1/4 rounded-t"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Side Features -->
        <div class="space-y-6">
          <div class="flex p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mr-6">
              <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-[#1B3A5C] mb-2">Search Books Online</h3>
              <p class="text-gray-600">Easily find books, journals, and digital media in our comprehensive catalog from anywhere.</p>
            </div>
          </div>
          
          <div class="flex p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex-shrink-0 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mr-6">
              <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-[#1B3A5C] mb-2">Self-Service Borrowing</h3>
              <p class="text-gray-600">Check out items, renew your loans, and manage your library account seamlessly online.</p>
            </div>
          </div>
          
          <div class="flex p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex-shrink-0 w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mr-6">
              <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-[#1B3A5C] mb-2">Upload & View Research</h3>
              <p class="text-gray-600">Submit your research proposals and access published works from university scholars.</p>
            </div>
          </div>
          
          <div class="flex p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex-shrink-0 w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mr-6">
              <svg class="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-[#1B3A5C] mb-2">Real-time Reports</h3>
              <p class="text-gray-600">Access dynamic statistics and analytics on library usage and material circulation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>
