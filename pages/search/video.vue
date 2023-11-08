<script setup lang="ts">
const route = useRoute()
const q = route.query.q as string
const {
  data: videos,
  status,
  pending,
} = useAsyncData('getSearch', () =>
  getSearch(q, 'video').then(({ data }) => data.items),
)
</script>

<template>
  <div>
    <h3 class="text-xl font-bold">Artist</h3>
    <div class="mt-2.5">
      <template v-if="pending"> Loading... </template>
      <template v-if="status === 'success'">
        <div
          v-if="videos.length === 0"
          class="flex min-h-[220px] flex-col items-center justify-center space-y-2 bg-alpha py-7 text-secondary"
        >
          <i class="ic-svg-artist-icon" />
          <p>Could not find any videos</p>
        </div>
        <template v-else>
          <div class="grid grid-cols-2 gap-x-7 gap-y-8 lg:grid-cols-3">
            <VideoCard
              v-for="video in videos"
              :key="video.encodeId"
              :item="video"
            />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
