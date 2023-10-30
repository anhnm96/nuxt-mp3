<script setup lang="ts">
const songList: any[] = []

useHead({
  title: 'Zing MP3',
  meta: [
    {
      name: 'description',
      content:
        'A clone of zingmp3.vn built with Nuxt to show the potential of it ✨',
    },
    { name: 'author', content: 'Minh Anh Nguyen' },
    {
      property: 'og:title',
      content: `Zing MP3`,
    },
    {
      property: 'og:image',
      content: `https://static-zmp3.zadn.vn/skins/common/logo600.png`,
    },
    {
      property: 'og:description',
      content: 'Enjoy high quality music',
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@nuxt_js' },
    { name: 'twitter:creator', content: '@anhnm896' },
  ],
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'preload',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap',
      as: 'style',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap',
      media: 'print',
      onload: "this.media='all'",
    },
  ],
})
</script>

<template>
  <div>
    <div class="flex bg-layout">
      <TheSidebar />
      <div class="flex-grow">
        <TheHeader />
        <main :class="songList.length > 0 ? 'h-main' : 'h-main-2'">
          <div class="mx-auto py-5" style="max-width: 90%">
            <NuxtPage />
          </div>
        </main>
      </div>
      <Playlist />
    </div>
  </div>
</template>
