import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: [
    '@gas-digital/components/lib/assets/styles/global.scss',
    '~/assets/styles/global.scss'
  ],
  srcDir: 'src/'
})
