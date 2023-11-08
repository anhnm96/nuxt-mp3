<script setup lang="ts">
defineProps<{
  item: any
}>()
</script>

<template>
  <div>
    <div class="group relative overflow-hidden rounded-md">
      <img
        class="transition-transform duration-700 group-hover:scale-110"
        :src="item.thumbnailM"
        :alt="item.title"
      />
      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
      >
        <button
          class="flex h-11 w-11 items-center justify-center rounded-full border border-white text-xl text-white hover:border-gray-200 hover:text-gray-200 focus:outline-none"
        >
          <i class="icon ic-play flex" />
        </button>
      </div>
    </div>
    <div class="mt-2 flex items-center space-x-2.5 space-y-1">
      <div v-if="item.artist" class="h-10 w-10 flex-shrink-0">
        <img
          class="rounded-full"
          :src="item.artist.thumbnail"
          :akt="item.artist.name"
        />
      </div>
      <div>
        <p class="text-title">
          {{ item.title }}
        </p>
        <p class="mt-1 text-xs text-secondary">
          {{ item.artistsNames }}
        </p>
      </div>
    </div>
  </div>
</template>
