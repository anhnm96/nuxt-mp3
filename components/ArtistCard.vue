<script setup lang="ts">
defineProps<{
  item: any
}>()
</script>

<template>
  <div>
    <div class="group relative overflow-hidden rounded-full">
      <img
        class="transition-transform duration-700 group-hover:scale-110"
        :src="item.thumbnail"
        :alt="item.name"
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
    <div class="mt-2 space-y-1 text-center">
      <p class="text-sm font-semibold">
        {{ item.name }}
      </p>
      <p class="text-xs text-secondary">{{ item.totalFollow }} follows</p>
    </div>
    <div class="text-center">
      <button
        class="mt-2 inline-flex items-center space-x-1.5 rounded-full border border-primary bg-alpha px-5 py-1 text-sm"
      >
        <i class="ic-addfriend" />
        <span>Follow</span>
      </button>
    </div>
  </div>
</template>
