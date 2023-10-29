import type { NuxtPage } from 'nuxt/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css', '~/assets/css/icons.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    apiUrl: '',
    apiKey: '',
    secretKey: '',
    version: '',
    proxyHost: '',
    proxyPort: '',
    proxyAuth: '',
  },
  hooks: {
    'pages:extend': function (pages) {
      const pagesToRemove: NuxtPage[] = []
      pages.forEach((page) => {
        if (page.path.includes('component')) pagesToRemove.push(page)
      })

      pagesToRemove.forEach((page: NuxtPage) => {
        pages.splice(pages.indexOf(page), 1)
      })
    },
  },
  components: {
    dirs: [
      {
        path: '~/pages',
        pattern: '*/components/**',
        pathPrefix: false,
      },
      {
        path: '~/components/base',
        extensions: ['vue'],
        prefix: 'base',
        ignore: ['**/*.story.vue'],
      },
      {
        path: '~/components/custom',
        extensions: ['vue'],
        ignore: ['**/stories/**', '**/*.story.vue'],
        pathPrefix: false,
      },
      {
        path: '~/components',
      },
    ],
  },
})
