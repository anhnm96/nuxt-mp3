<script setup lang="ts">
import type { Song } from '@/types'
import { PlayerState } from '@/types'

const props = defineProps<{
  song: Song
  active?: boolean
}>()
const store = usePlayer()

function play() {
  if (props.active) {
    store.togglePlay()
  } else {
    // setTimeout for delay setCurrentSong. If not
    // the clickOutside will not detect that event.target
    // was child of Playlist
    // (cause this commit makes component rerender)
    // so it leads to unexpected
    // close Playlist sidebar
    setTimeout(() => {
      store.setCurrentSong(props.song)
    }, 0)
  }
}

const isPlaying = computed(() => store.playerState === PlayerState.PLAYING)
const isLoading = computed(() => store.playerState === PlayerState.LOADING)
</script>

<template>
  <div
    class="group flex items-start space-x-2.5 rounded p-2"
    :class="{ 'bg-purple-primary': active, 'hover:bg-alpha': !active }"
    @dblclick="play"
  >
    <!-- thumbnail -->
    <div class="relative flex-shrink-0 overflow-hidden rounded">
      <img class="h-10 w-10" :src="song.thumbnail" alt="thumbnail" />
      <div
        class="absolute inset-0 bg-black bg-opacity-40 hover:opacity-100 group-hover:opacity-100"
        :class="active ? 'opacity-100' : 'opacity-0'"
      >
        <button
          :disabled="isLoading && active"
          class="flex h-full w-full items-center justify-center text-white focus:outline-none"
          @click.prevent="play"
        >
          <i
            v-show="!isLoading"
            class="icon flex"
            :class="{
              'ic-gif-playing-white': active && isPlaying,
              'ic-play': (active && !isPlaying) || !active,
            }"
          />
          <Spinner v-if="isLoading && active" />
        </button>
      </div>
    </div>
    <div class="select-none overflow-hidden">
      <h4
        class="truncate text-sm font-bold"
        :class="active ? 'text-white' : 'text-primary'"
        :title="song.title"
      >
        {{ song.title }}
      </h4>
      <p
        class="mt-0.5 truncate text-xs text-secondary"
        :class="active && 'text-gray-100'"
      >
        <span v-for="(artist, index) in song.artists" :key="artist.id">
          <span>{{ artist.name }}</span>
          <template
            v-if="song.artists.length > 1 && index < song.artists.length - 1"
            >,&nbsp;</template
          >
        </span>
      </p>
    </div>
  </div>
</template>
