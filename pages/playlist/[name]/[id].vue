<script setup lang="ts">
import type { Playlist, Song } from '@/types'

definePageMeta({
  alias: '/album/:name/:id',
})
const store = usePlayer()
const route = useRoute()
const id = route.params.id as string
const isPlaying = computed(() => {
  return store.isPlaying && store.playlist?.encodeId === id
})

const { data: album, pending } = useAsyncData<Playlist>('playlist-detail', () =>
  getPlaylistDetail(id).then(({ data }) => data),
)

function togglePlay() {
  if (!store.playlist || store.playlist.encodeId !== album.value?.encodeId) {
    store.setState({ prop: 'playlist', value: album.value })
    store.setState({
      prop: 'currentSong',
      value: album.value!.song.items[0],
    })
  } else {
    store.togglePlay()
  }
}

function playsong(song: Song) {
  if (!store.playlist || store.playlist.encodeId !== album.value?.encodeId) {
    store.setState({ prop: 'playlist', value: album.value })
  }
  store.setState({ prop: 'currentSong', value: song })
}
</script>

<template>
  <div class="flex flex-col clg:flex-row clg:space-x-9">
    <h4 v-if="pending">Loading...</h4>
    <template v-else-if="album">
      <!-- left -->
      <div class="album-info">
        <div class="album-wrapper sticky top-0">
          <div
            class="album-cover"
            :class="{ rotate: isPlaying }"
            @click="togglePlay"
          >
            <img :src="album.thumbnailM" :alt="album.title" />
            <div class="overlay">
              <button class="btn-play">
                <i
                  class="icon"
                  :class="isPlaying ? 'ic-gif-playing-white' : 'ic-play'"
                />
              </button>
            </div>
          </div>
          <div class="flex flex-col justify-between clg:block">
            <div>
              <h1 class="album-title">
                {{ album.title }}
              </h1>
              <p class="album-info mt-1">
                Cập nhật:
                {{
                  new Date(album.contentLastUpdate * 1000).toLocaleDateString()
                }}
              </p>
              <p class="album-info">{{ album.like }} Người yêu thích</p>
            </div>
            <div class="flex space-x-3 clg:block">
              <button
                class="mt-3 inline-flex space-x-2 rounded-full bg-purple-primary px-6 py-2.5 uppercase text-white hover:brightness-90"
              >
                <i class="icon ic-play flex h-5 w-5 place-items-center" />
                <span>Phát ngẫu nhiên</span>
              </button>
              <div class="album-footer">
                <button>
                  <i class="icon ic-like" />
                </button>
                <button>
                  <i class="icon ic-more" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- right -->
      <div class="mt-4 flex-grow clg:mt-0">
        <p class="text-sm">
          <span class="text-secondary">Lời tựa: </span>
          <span class="font-semibold text-primary">{{
            album.description
          }}</span>
        </p>
        <div class="mt-4">
          <SongItem
            v-for="song in album.song.items"
            :key="`${song.title}-${song.artistsNames}`"
            :song="song"
            @playsong="playsong"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.album-info {
  width: 300px;
  @apply relative;
}
.album-cover {
  transition: all 0.4s ease;
  box-shadow: 0 5px 8px 0 rgb(0 0 0 / 20%);
  @apply relative overflow-hidden rounded-lg;
}
.rotate {
  @apply animate-spin;
  border-radius: 100%;
  overflow: hidden;
  animation-duration: 12s;
  animation-delay: 700ms;
}
.album-cover img {
  transition: transform 0.5s;
}
.album-cover:hover img {
  transform: scale(1.1);
}
.album-cover .overlay {
  transition: opacity 0.5s;
  background-color: rgba(0, 0, 0, 0.4);
  @apply absolute inset-0 opacity-0;
}
.album-cover:hover .overlay,
.album-cover.rotate .overlay {
  @apply opacity-100;
}
.btn-play {
  @apply flex h-full w-full items-center justify-center text-lg text-white;
}
.btn-play > i {
  @apply flex h-10 w-10 items-center justify-center rounded-full border border-white;
}
.album-title {
  @apply mt-2 text-center text-xl font-bold text-primary;
}
.album-info {
  @apply text-center text-sm text-secondary;
}

.album-footer {
  @apply mt-4 flex justify-center space-x-4;
}
.album-footer button {
  @apply flex h-9 w-9 items-center justify-center rounded-full bg-alpha text-lg text-primary outline-none;
}
.album-footer button i {
  @apply flex;
}

@media only screen and (max-width: 1200px) {
  .footer-wrapper {
    display: flex;
  }
  .album-title {
    text-align: left;
  }
  .album-info {
    text-align: left;
    width: 100%;
  }
  .album-wrapper {
    @apply space-x-4;
    display: flex;
  }
  .album-cover img {
    width: 200px;
  }
  .album-footer {
    justify-content: start;
  }
}
</style>
