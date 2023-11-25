<script setup lang="ts">
import type { Playlist } from '@/types'

const props = defineProps<{
  item: Playlist
  showArtist?: boolean
}>()
const playerStore = usePlayer()
const { status, execute: fetchSongList } = useAsyncData(
  'songlist',
  () =>
    getSongList(props.item.encodeId).then(({ data }) => {
      playerStore.setState({ prop: 'playlist', value: data })
      playerStore.setState({
        prop: 'currentSong',
        value: data.song.items[0],
      })
      return data
    }),
  { immediate: false },
)

const isActive = computed(() => {
  return props.item.encodeId === playerStore.playlist?.encodeId
})

function fetchListAndPlay() {
  if (isActive.value) {
    playerStore.togglePlay()
  } else {
    fetchSongList()
  }
}
</script>

<template>
  <div>
    <div class="group relative overflow-hidden rounded-md pb-[100%]">
      <img
        class="absolute inset-0 w-full transition-transform duration-700 group-hover:scale-110"
        :src="item.thumbnailM"
        alt="img"
      />
      <div
        class="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:bg-black group-hover:bg-opacity-40 group-hover:opacity-100"
        :class="isActive ? 'opacity-100' : 'opacity-0'"
      >
        <button
          class="flex items-center justify-center text-xl text-white focus:outline-none"
        >
          <i class="ic-like flex" />
        </button>
        <button
          class="flex h-11 w-11 items-center justify-center rounded-full border border-white text-xl text-white hover:border-gray-200 hover:text-gray-200 focus:outline-none"
          @click="fetchListAndPlay"
        >
          <Spinner v-if="status === 'pending'" />
          <i
            v-else
            class="icon flex"
            :class="
              isActive && playerStore.isPlaying
                ? 'ic-gif-playing-white'
                : 'ic-play'
            "
          />
        </button>
        <button
          class="flex items-center justify-center text-xl text-white focus:outline-none"
        >
          <i class="ic-more flex" />
        </button>
      </div>
    </div>
    <div class="mt-2">
      <h4>
        <NuxtLink
          class="text-title"
          :to="item.link.split('.')[0]"
          :title="item.title"
        >
          {{ item.title }}
        </NuxtLink>
      </h4>
      <p v-if="showArtist && item.artistsNames" class="text-artist">
        {{ item.artistsNames }}
      </p>
    </div>
  </div>
</template>
