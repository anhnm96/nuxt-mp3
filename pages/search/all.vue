<script setup lang="ts">
const route = useRoute()
const query = route.query.q as string
const {
  data: search,
  pending,
  status,
} = await useAsyncData('searchAll', () => getSearchAll(query))
</script>

<template>
  <div>
    <p v-if="pending">Loading...</p>
    <template v-if="status === 'success'">
      <!-- top results -->
      <div v-if="search.top">
        <h3 class="text-xl font-bold">
          Top Results for <span class="italic">"{{ query }}"</span>
        </h3>
        <div class="mt-3.5 w-[400px] bg-box-item shadow">
          <div class="flex items-center space-x-2 rounded-md p-2.5">
            <div class="relative h-20 w-20">
              <img
                class="rounded"
                :src="search.top.thumbnail"
                :alt="
                  search.top.objectType === 'song'
                    ? search.top.title
                    : search.top.name
                "
              />
            </div>
            <div>
              <p class="text-sm font-medium">
                {{
                  search.top.objectType === 'song'
                    ? search.top.title
                    : search.top.name
                }}
              </p>
              <p class="text-xs text-secondary">
                {{ search.top.objectType }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- songs -->
      <div v-if="search.songs" class="mt-8">
        <h3 class="flex items-center text-xl font-bold">
          <NuxtLink
            :to="{ name: 'search-song', query: { q: $route.query.q } }"
            class="flex items-center hover:text-link-hover"
          >
            Songs &nbsp;<i class="ic-go-right flex text-lg" />
          </NuxtLink>
        </h3>
        <ul class="mt-2.5">
          <li v-for="song in search.songs" :key="song.encodeId">
            <SongItem :song="song" :safe-to-play="true" />
          </li>
        </ul>
      </div>
      <!-- Playlist/Album -->
      <div v-if="search.playlists" class="mt-8">
        <!-- <PlaylistCarousel :items="search.playlists">
          <h3 class="flex items-center text-xl font-bold">
            <router-link
              :to="{name: 'SearchPlaylist', query: {q: $route.query.q}}"
              class="flex items-center hover:text-link-hover"
            >
              Playlist/Album
              &nbsp;<i class="flex text-lg ic-go-right" />
            </router-link>
          </h3>
        </PlaylistCarousel> -->
      </div>
      <!-- mv -->
      <div v-if="search.videos" class="mt-8">
        <!-- <PlaylistCarousel
          :items="search.videos"
          :as="videoCard"
          item-class="w-1/2 cxl:w-1/3"
        >
          <h3 class="flex items-center text-xl font-bold">
            <router-link
              :to="{name: 'SearchVideo', query: {q: $route.query.q}}"
              class="flex items-center hover:text-link-hover"
            >
              MV
              &nbsp;<i class="flex text-lg ic-go-right" />
            </router-link>
          </h3>
        </PlaylistCarousel> -->
      </div>
      <!-- artists -->
      <div v-if="search.artists" class="mt-8">
        <!-- <PlaylistCarousel
          :items="search.artists"
          :as="artistCard"
        >
          <h3 class="flex items-center text-xl font-bold">
            <router-link
              :to="{name: 'SearchArtist', query: {q: $route.query.q}}"
              class="flex items-center hover:text-link-hover"
            >
              Artists
              &nbsp;<i class="flex text-lg ic-go-right" />
            </router-link>
          </h3>
        </PlaylistCarousel> -->
      </div>
    </template>
  </div>
</template>
