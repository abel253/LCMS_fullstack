<template>
  <div class="min-h-screen flex flex-col bg-[#EAF9FF]">
    <LayoutAppHeader />
    <main class="flex-grow bg-[#EAF9FF]">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.page-enter-active, .page-leave-active {
  transition: all 0.3s;
}
.page-enter-from, .page-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}
</style>