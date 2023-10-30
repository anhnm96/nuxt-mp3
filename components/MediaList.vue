<script setup lang="ts">
import type { Playlist } from '@/types'

withDefaults(
  defineProps<{
    title?: string
    items: Playlist[]
    as?: string
    itemClass?: string
  }>(),
  {
    title: '',
    as: 'PlaylistCard',
    itemClass: 'w-1/3 md:w-1/4 cxl:w-1/5',
  },
)
</script>

<template>
  <Carousel items-class="overflow-x-auto w-full flex mt-3 -mx-3">
    <template #header="{ prev, next }">
      <div class="flex justify-between">
        <slot>
          <h3 class="text-xl font-bold text-primary">
            {{ title }}
          </h3>
        </slot>
        <div class="flex items-center space-x-2">
          <button
            class="inline-flex items-center p-1 focus:outline-none"
            aria-label="Previous List"
            @click="prev"
          >
            <i class="ic-go-left h-5 w-5 text-primary" />
          </button>
          <button
            class="inline-flex items-center p-1 focus:outline-none"
            aria-label="Next List"
            @click="next"
          >
            <i class="ic-go-right h-5 w-5 text-primary" />
          </button>
        </div>
      </div>
    </template>
    <template #default>
      <CarouselItem
        v-for="item in items"
        :key="item.title"
        class="flex-shrink-0 select-none px-3"
        :class="[itemClass]"
      >
        <PlaylistCard :item="item" />
      </CarouselItem>
    </template>
  </Carousel>
</template>
