<script setup lang="ts">
const route = useRoute()
const q = route.query.q as string
const {
  data: playlists,
  status,
  pending,
} = useAsyncData(
  'getSearch',
  () => getSearch(q, 'playlist').then(({ data }) => data),
  {
    pick: 'items',
    default: () => [],
  },
)
</script>

<template>
  <div>
    <h3 class="text-xl font-bold">Playlist/Album</h3>
    <div class="mt-2.5">
      <template v-if="pending"> Loading... </template>
      <template v-if="status === 'success'">
        <div class="grid grid-cols-4 gap-7 cxl:grid-cols-5">
          <PlaylistCard
            v-for="playlist in playlists"
            :key="playlist.encodeId"
            :item="playlist"
            :show-artist="true"
          />
        </div>
      </template>
    </div>
  </div>
</template>
