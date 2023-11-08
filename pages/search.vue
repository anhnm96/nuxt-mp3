<script setup lang="ts">
const route = useRoute()
const query = route.query.q as string
const { data: counter } = await useAsyncData('searchCounter', () =>
  getSearchCounter(query).then(({ data }) => data),
)
</script>

<template>
  <div>
    <div class="flex items-center border-b border-primary">
      <h2
        class="hidden flex-shrink-0 border-r border-primary pr-5 text-2xl font-bold text-primary clg:block"
      >
        Search Results
      </h2>
      <ul
        class="flex space-x-10 text-sm font-medium uppercase text-navigation clg:pl-5"
      >
        <li class="text-navigation">
          <NuxtLink
            class="inline-flex py-3.5 text-navigation hover:text-item-hover"
            active-class="border-b-2 text-item-hover border-purple-primary"
            :to="{ name: 'search-all', query: { q: $route.query.q } }"
          >
            All
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            class="inline-flex space-x-1 py-3.5 text-navigation hover:text-item-hover"
            active-class="border-b-2 text-item-hover border-purple-primary"
            :to="{ name: 'search-song', query: { q: $route.query.q } }"
          >
            <span>Song</span>
            <span class="rounded-full bg-alpha px-1.5 py-0.5 text-xs">{{
              counter?.song
            }}</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            class="inline-flex space-x-1 py-3.5 text-navigation hover:text-item-hover"
            active-class="border-b-2 text-item-hover border-purple-primary"
            :to="{ name: 'search-playlist', query: { q: $route.query.q } }"
          >
            <span>Playlist/Album</span>
            <span class="rounded-full bg-alpha px-1.5 py-0.5 text-xs">{{
              counter?.playlist
            }}</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            class="inline-flex space-x-1 py-3.5 text-navigation hover:text-item-hover"
            active-class="border-b-2 text-item-hover border-purple-primary"
            :to="{ name: 'search-artist', query: { q: $route.query.q } }"
          >
            <span>Artist</span>
            <span class="rounded-full bg-alpha px-1.5 py-0.5 text-xs">{{
              counter?.artist
            }}</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            class="inline-flex space-x-1 py-3.5 text-navigation hover:text-item-hover"
            active-class="border-b-2 text-item-hover border-purple-primary"
            :to="{ name: 'search-video', query: { q: $route.query.q } }"
          >
            <span>MV</span>
            <span class="rounded-full bg-alpha px-1.5 py-0.5 text-xs">{{
              counter?.video
            }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="mt-5">
      <NuxtPage />
    </div>
  </div>
</template>
