<script setup lang="ts">
import { PlayerMode, PlayerState } from '@/types'

const store = usePlayer()
const song = computed(() => store.currentSong)

const currentTime = computed<number>({
  get() {
    return store.currentTime
  },
  set(val) {
    store.updateSeek(val)
  },
})

const volume = computed<number>({
  get() {
    return store.volume
  },
  set(val: number) {
    store.setVolume(val)
  },
})

function handleKeyDown(e: KeyboardEvent) {
  if ((e.target as any).tagName === 'BUTTON') e.preventDefault()
  if (e.code === 'Space') {
    store.togglePlay()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

const currentSong = computed(() => store.currentSong)
const seek = computed<string>(() => store.seek)
const playerState = computed<PlayerState>(() => store.playerState)
const isMuted = computed<boolean>(() => store.isMuted)
const showLyric = computed<boolean>(() => store.showLyric)
const duration = computed(() => store.duration)
const isShuffled = computed(() => store.isShuffled)
const playerMode = computed(() => store.playerMode)
const toggleMute = () => store.toggleMute()
const toggleShowLyric = () => store.toggleShowLyric()
const toggleShowPlaylist = () => store.toggleShowPlaylist()
const toggleShuffleSongList = () => store.toggleShuffleSongList()
const playNext = () => store.playNext()
const playPrevious = () => store.playPrevious()
const setNextPlayerMode = () => store.setNextPlayerMode()
</script>

<template>
  <div
    id="player"
    class="fixed bottom-0 w-full bg-layout"
    :class="{
      playing: playerState === PlayerState.PLAYING,
      'border-none bg-transparent': showLyric,
    }"
  >
    <div
      class="flex h-22 w-full items-center space-x-2 border-t-player pl-10 pr-5"
      :class="showLyric ? 'bg-transparent' : 'bg-player'"
    >
      <!-- left -->
      <div class="flex w-1/3 space-x-3">
        <!-- thumbnail -->
        <div class="pointer-events-none relative flex-shrink-0 text-player">
          <img class="thumbnail" :src="song.thumbnail" alt="thumbnail" />
          <svg fill="currentColor" viewBox="0 0 512 512" class="note note-1">
            <path
              d="M470.38 1.51L150.41 96A32 32 0 0 0 128 126.51v261.41A139 139 0 0 0 96 384c-53 0-96 28.66-96 64s43 64 96 64 96-28.66 96-64V214.32l256-75v184.61a138.4 138.4 0 0 0-32-3.93c-53 0-96 28.66-96 64s43 64 96 64 96-28.65 96-64V32a32 32 0 0 0-41.62-30.49z"
            />
          </svg>
          <svg fill="currentColor" viewBox="0 0 384 512" class="note note-2">
            <path
              d="M310.94 1.33l-96.53 28.51A32 32 0 0 0 192 60.34V360a148.76 148.76 0 0 0-48-8c-61.86 0-112 35.82-112 80s50.14 80 112 80 112-35.82 112-80V148.15l73-21.39a32 32 0 0 0 23-30.71V32a32 32 0 0 0-41.06-30.67z"
            />
          </svg>
          <svg fill="currentColor" viewBox="0 0 512 512" class="note note-3">
            <path
              d="M470.38 1.51L150.41 96A32 32 0 0 0 128 126.51v261.41A139 139 0 0 0 96 384c-53 0-96 28.66-96 64s43 64 96 64 96-28.66 96-64V214.32l256-75v184.61a138.4 138.4 0 0 0-32-3.93c-53 0-96 28.66-96 64s43 64 96 64 96-28.65 96-64V32a32 32 0 0 0-41.62-30.49z"
            />
          </svg>
          <svg fill="currentColor" viewBox="0 0 384 512" class="note note-4">
            <path
              d="M310.94 1.33l-96.53 28.51A32 32 0 0 0 192 60.34V360a148.76 148.76 0 0 0-48-8c-61.86 0-112 35.82-112 80s50.14 80 112 80 112-35.82 112-80V148.15l73-21.39a32 32 0 0 0 23-30.71V32a32 32 0 0 0-41.06-30.67z"
            />
          </svg>
        </div>
        <!-- detail -->
        <div class="flex flex-col justify-center space-y-1 overflow-hidden">
          <h4 class="text-md truncate font-semibold text-player">
            {{ song.title }}
          </h4>
          <p class="text-xs text-player">
            {{ song.artistsNames }}
          </p>
        </div>
        <!-- actions -->
        <div class="flex place-items-center">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-player hover:bg-alpha"
          >
            <i class="ic-like flex" />
          </button>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-player hover:bg-alpha"
          >
            <i class="ic-more flex" />
          </button>
        </div>
      </div>
      <!-- center -->
      <div
        class="flex-grow -translate-x-5 transform"
        :class="showLyric && 'flex flex-col-reverse'"
      >
        <!-- controls -->
        <div class="flex items-center justify-center space-x-4">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-base text-player hover:bg-alpha focus:outline-none"
            :class="isShuffled && 'text-link-hover'"
            @click="toggleShuffleSongList"
          >
            <i class="ic-shuffle flex" />
          </button>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-base text-player hover:bg-alpha focus:outline-none"
            @click="playPrevious"
          >
            <i class="ic-pre flex" />
          </button>
          <button
            :disabled="playerState === PlayerState.LOADING"
            class="flex h-12 w-12 items-center justify-center rounded-full text-4xl text-player focus:outline-none"
            @click="store.togglePlay"
          >
            <i
              class="flex"
              :class="{
                'ic-pause-circle-outline': playerState === PlayerState.PLAYING,
                'ic-play-circle-outline': playerState === PlayerState.PAUSE,
              }"
            />
            <Loading v-if="playerState === PlayerState.LOADING" />
          </button>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-base text-player hover:bg-alpha focus:outline-none"
            @click="playNext"
          >
            <i class="ic-next flex" />
          </button>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-base text-player hover:bg-alpha focus:outline-none"
            :class="{ 'text-link-hover': playerMode !== PlayerMode.DEFAULT }"
            @click="setNextPlayerMode"
          >
            <i
              class="flex"
              :class="
                playerMode === PlayerMode.REPEAT_SONG
                  ? 'ic-repeat-one'
                  : 'ic-repeat'
              "
            />
          </button>
        </div>
        <!-- seeker -->
        <div class="flex items-center space-x-3">
          <span class="text-xs font-semibold text-player opacity-50">{{
            seek
          }}</span>
          <ProgressBar
            v-model:progress="currentTime"
            :max="currentSong.duration"
          />
          <span class="text-xs font-bold text-player">{{ duration }}</span>
        </div>
      </div>
      <!-- right -->
      <div class="flex w-1/3 items-center justify-end">
        <button
          v-if="song.mvlink"
          class="flex h-8 w-8 items-center justify-center rounded-full text-player hover:bg-alpha focus:outline-none"
        >
          <i class="ic-mv flex" />
        </button>
        <button
          class="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-player hover:bg-alpha focus:outline-none"
          @click="toggleShowLyric"
        >
          <i class="ic-karaoke flex" />
        </button>
        <div class="ml-2 flex items-center space-x-2">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-player hover:bg-alpha focus:outline-none"
            @click="toggleMute"
          >
            <i class="flex" :class="isMuted ? 'ic-volume-mute' : 'ic-volume'" />
          </button>
          <ProgressBar v-model:progress="volume" :max="1" style="width: 70px" />
        </div>
        <div class="btn-toggle ml-6 border-l border-player pl-4">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-player hover:bg-alpha focus:outline-none"
            @click="toggleShowPlaylist"
          >
            <i class="ic-list-music flex" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thumbnail {
  @apply h-16 w-16 rounded-full;
  border: 3px solid var(--banner-home-dot);
  animation-name: spin;
  animation-duration: 12s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-play-state: paused;
}

.note {
  height: 10px;
  width: 10px;
  position: absolute;
  top: calc(50% - 5px);
  left: calc(50% - 5px);
  opacity: 0;
  -webkit-animation-name: bubble-1;
  animation-name: bubble-1;
  animation-iteration-count: infinite;
  animation-duration: 4.8s;
  animation-timing-function: linear;
  animation-play-state: paused;
}
.note-2 {
  animation-delay: 1.2s;
  animation-name: bubble-2;
}

.note-3 {
  animation-delay: 2.4s;
}

.note-4 {
  animation-delay: 3.6s;
  animation-name: bubble-2;
}

.playing :is(.thumbnail, .note) {
  animation-play-state: running;
}

@media only screen and (min-width: 1636px) {
  .btn-toggle {
    display: none;
  }
}

@keyframes bubble-1 {
  0% {
    opacity: 0;
    transform: rotate(90deg) translate(40px) rotate(-90deg);
  }

  50% {
    opacity: 1;
    transform: rotate(180deg) translate(55px) rotate(-180deg) scale(1.3);
  }

  100% {
    opacity: 0;
    transform: rotate(260deg) translate(70px) rotate(-260deg) scale(1.7)
      rotate(45deg) rotate(50deg);
  }
}

@keyframes bubble-2 {
  0% {
    opacity: 0;
    transform: rotate(90deg) translate(40px) rotate(-90deg);
  }

  50% {
    opacity: 1;
    transform: rotate(175deg) translate(57.5px) rotate(-175deg) scale(1.3)
      rotate(-50deg);
  }

  100% {
    opacity: 0;
    transform: rotate(260deg) translate(75px) rotate(-260deg) scale(1.7)
      rotate(45deg) rotate(-50deg);
  }
}
</style>
