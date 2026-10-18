// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    databaseUrl: process.env.DATABASE_URL,

    public: {
      appName: 'MAU Library System',
      apiBase: '/api',
    },
  },

  nitro: {
    preset: 'node-server',
    externals: {
      inline: ['@prisma/client'],
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

  typescript: {
    strict: true,
    typeCheck: false,
  },

  routeRules: {
    '/api/**': { cors: true },
  },
  
  devtools: { enabled: false },  // ← Warning 2 ያስወግዳል
  
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },
  
  postcss: {
    plugins: {
      'tailwindcss/nesting': {},  // ← Warning 1
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})