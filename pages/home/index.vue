<script setup lang="ts">
definePageMeta({
  path: '/',
})

const { data, pending } = await useAsyncData('home', () => getHome(1))
</script>

<template>
  <div v-if="pending" class="relative">
    <Skeleton
      class="absolute inset-0 z-10 m-auto aspect-video w-[70%] -translate-x-1/3 scale-75 lg:w-[46%] lg:-translate-x-[65%] lg:scale-[.85]"
    />
    <Skeleton class="z-20 m-auto aspect-video w-[70%] shrink-0 lg:w-[46%]" />
    <Skeleton
      class="absolute inset-0 z-10 m-auto aspect-video w-[70%] translate-x-1/3 scale-75 lg:w-[46%] lg:translate-x-[65%] lg:scale-[.85]"
    />
  </div>
  <template v-else-if="data">
    <template v-for="(section, index) in data.data.items">
      <section v-if="section.sectionType === 'banner'" :key="index">
        <Banner :items="section.items" />
      </section>
    </template>
  </template>
</template>
