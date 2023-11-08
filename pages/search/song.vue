<script setup lang="ts">
const route = useRoute()
const q = route.query.q as string
const {
  data: songs,
  status,
  pending,
} = useAsyncData(
  'getSearch',
  () => getSearch(q, 'song').then(({ data }) => data.items),
  {
    default: () => [],
  },
)
</script>

<template>
  <div>
    <h3 class="text-xl font-bold">Song</h3>
    <div class="mt-2.5">
      <template v-if="pending"> Loading... </template>
      <template v-if="status === 'success'">
        <SongItem
          v-for="song in songs"
          :key="song.encodeId"
          :song="song"
          :safe-to-play="true"
        />
      </template>
    </div>
  </div>
</template>
