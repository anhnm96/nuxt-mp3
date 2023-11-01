<script setup lang="ts">
import { PlayerState } from '@/types'

const props = defineProps<{
  song: any
  safeToPlay: boolean
}>()
const emit = defineEmits(['playsong'])
const store = usePlayer()

function playSong() {
  if (store.currentSong?.encodeId !== props.song.encodeId) {
    if (props.safeToPlay) {
      store.setState({ prop: 'playlist', value: null })
      store.setState({ prop: 'currentSong', value: props.song })
      return
    }
    emit('playsong', props.song)
  } else {
    store.togglePlay()
  }
}

const songDuration = computed(() => {
  return displayDuration(props.song.duration, 2)
})

const isCurrent = computed(
  () => store.currentSong?.encodeId === props.song.encodeId,
)
const isPlaying = computed(
  () => isCurrent.value && store.playerState === PlayerState.PLAYING,
)
</script>

<template>
  <div
    class="flex cursor-pointer items-center justify-between border-t border-solid border-player p-2 hover:bg-alpha"
    :class="isCurrent && 'bg-alpha'"
    @dblclick="playSong"
  >
    <!-- left -->
    <div class="flex flex-1 items-center space-x-2">
      <div class="relative h-10 w-10 overflow-hidden rounded">
        <img :src="song.thumbnail" alt="thumbnail" />
        <!-- overlay  -->
        <div
          class="absolute inset-0 bg-black bg-opacity-40"
          :class="!isCurrent && 'opacity-0 hover:opacity-100'"
        >
          <button
            class="flex h-full w-full place-items-center"
            @click="playSong"
          >
            <span class="mx-auto h-5 w-5 text-white">
              <i
                class="icon flex justify-center"
                :class="isPlaying ? 'ic-gif-playing-white' : 'ic-play'"
              />
            </span>
          </button>
        </div>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-primary">
          {{ song.title }}
        </h4>
        <p class="text-xs text-secondary">
          <span v-for="(artist, index) in song.artists" :key="artist.name">
            <span>{{ artist.name }}</span>
            <span v-if="index !== song.artists.length - 1">, </span>
          </span>
        </p>
      </div>
    </div>
    <!-- right -->
    <div class="flex flex-1 space-x-2">
      <div class="flex flex-1 items-center text-xs text-primary">
        <span>{{ songDuration }}</span>
      </div>
      <button
        v-if="song.mvlink"
        class="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-alpha focus:outline-none"
      >
        <i class="icon ic-mv flex" />
      </button>
      <button
        v-if="song.hasLyric"
        class="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-alpha focus:outline-none"
      >
        <i class="icon ic-karaoke flex" />
      </button>
      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-alpha focus:outline-none"
      >
        <i class="icon ic-like flex" />
      </button>
      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-alpha focus:outline-none"
      >
        <i class="icon ic-more flex" />
      </button>
    </div>
  </div>
</template>
