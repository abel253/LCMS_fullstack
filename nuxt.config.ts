// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  css: ['./app/assets/css/tailwind.css'],
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  // 🔐 Runtime config
  runtimeConfig: {
    // 🔒 Server-only
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    databaseUrl: process.env.DATABASE_URL,

    public: {
      appName: 'MAU Library System',
      apiBase: '/api',
    },
  },

  // ⚙️ Nitro
  nitro: {
    preset: 'node-server',
    externals: {
      inline: ['@prisma/client'],
    },
    experimental: {
      wasm: true,
    },
  },

  app: {
    head: {
      title: 'MAU Library System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Mekdela Amba University Library Circulation System',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  routeRules: {
    '/api/**': { cors: true },
  },
})