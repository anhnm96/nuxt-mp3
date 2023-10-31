<script setup lang="ts">
const playerStore = usePlayer()
const currentSong = computed(() => playerStore.currentSong)
const showPlaylist = computed(() => playerStore.showPlaylist)

function close(e: MouseEvent) {
  if (!showPlaylist.value) return
  const playerEl = document.getElementById('player')
  if (!playerEl?.contains(e.target as HTMLElement)) {
    playerStore.toggleShowPlaylist()
  }
}
</script>

<template>
  <aside
    v-click-outside="close"
    class="playlist relative w-80 flex-shrink-0 border-l border-primary"
    :style="{ transform: showPlaylist ? 'translateX(0)' : '' }"
  >
    <!-- tabs -->
    <div
      class="z-20 flex h-17 items-center space-x-1 bg-[color:var(--layout-bg)] px-2 py-4"
    >
      <div class="flex rounded-full bg-alpha p-1">
        <button
          class="rounded-full bg-tab-active px-3 py-1.5 text-xs font-semibold text-item-hover focus:outline-none"
        >
          Danh sách phát
        </button>
        <button
          class="rounded-full px-3 py-1.5 text-xs font-semibold text-secondary focus:outline-none"
        >
          Nghe gần đây
        </button>
      </div>
      <button
        class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-primary text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!currentSong"
      >
        <i class="ic-clock flex" />
      </button>
      <button
        class="flex h-8 w-8 items-center justify-center rounded-full bg-alpha text-secondary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!currentSong"
      >
        <i class="ic-more flex" />
      </button>
    </div>
    <div class="px-2">
      <div v-show="currentSong" class="h-main">
        <template v-if="currentSong">
          <!-- Previous songs -->
          <SongQueue
            v-for="song in playerStore.previousSongs"
            :key="`${song.title}-${song.artistsNames}`"
            :song="song"
            class="opacity-50 hover:opacity-100"
          />
          <!-- Current song -->
          <SongQueue :active="true" :song="currentSong" />
          <template v-if="playerStore.playlist">
            <!-- Next songs intro -->
            <div class="mt-3">
              <h4 class="text-sm font-bold">Tiếp theo</h4>
              <p class="text-sm font-semibold text-secondary">
                Từ playlist
                <span class="text-bg">{{ playerStore.playlist.title }}</span>
              </p>
            </div>
            <!-- Songs in queue -->
            <div class="mt-2">
              <SongQueue
                v-for="song in playerStore.nextSongs"
                :key="`${song.title}-${song.artistsNames}`"
                :song="song"
              />
            </div>
          </template>
        </template>
      </div>
      <template v-if="!currentSong">
        <div v-for="i in 4" :key="i" class="flex space-x-2.5 p-2">
          <Skeleton :animate="false" class="h-10 w-10 flex-shrink-0 rounded" />
          <div class="flex flex-grow flex-col space-y-2">
            <Skeleton :animate="false" class="h-3.5" />
            <Skeleton :animate="false" class="h-3.5 w-1/2" />
          </div>
        </div>
        <div
          class="absolute top-1/2 flex -translate-y-1/2 transform flex-col items-center space-y-4 px-8"
        >
          <h4
            class="text-center text-sm text-primary"
            style="word-break: 'break-word'"
          >
            Khám phá thêm các bài hát mới của Zing MP3
          </h4>
          <button
            class="flex items-center space-x-2 rounded-full bg-purple-primary px-6 py-1.5 text-sm font-semibold text-white"
          >
            <i class="ic-play flex" />
            <span class="flex">Phát nhạc mới phát hành</span>
          </button>
        </div>
      </template>
    </div>
  </aside>
</template>

<style scoped>
@media only screen and (max-width: 1636px) {
  .playlist {
    position: fixed;
    transform: translateX(100%);
    right: 0;
    top: 0;
    z-index: 100;
    background-color: var(--queue-player-popup-bg);
  }
}

.playlist {
  transition: all 0.3s;
}
</style>
