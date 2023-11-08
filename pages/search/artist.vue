<script setup lang="ts">
const route = useRoute()
const q = route.query.q as string
const {
  data: artists,
  status,
  pending,
} = useAsyncData('getSearch', () =>
  getSearch(q, 'artist').then(({ data }) => data.items),
)
</script>

<template>
  <div>
    <h3 class="text-xl font-bold">Artist</h3>
    <div class="mt-2.5">
      <template v-if="pending"> Loading... </template>
      <template v-if="status === 'success'">
        <div
          v-if="artists.length === 0"
          class="flex min-h-[220px] flex-col items-center justify-center space-y-2 bg-alpha py-7 text-secondary"
        >
          <i class="ic-svg-artist-icon" />
          <p>Could not find any artists</p>
        </div>
        <template v-else>
          <div class="grid grid-cols-4 gap-x-7 gap-y-8 cxl:grid-cols-5">
            <ArtistCard
              v-for="artist in artists"
              :key="artist.id"
              :item="artist"
            />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
