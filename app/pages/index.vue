<!-- app/pages/index.vue -->
<script setup lang="ts">
// ✅ ወዲያውኑ ወደ /search ቀይር
await navigateTo('/search')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="text-center">
      <div class="text-6xl mb-4">📚</div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">MAU Library System</h1>
      <p class="text-gray-600">Redirecting to search...</p>
    </div>
  </div>
</template>