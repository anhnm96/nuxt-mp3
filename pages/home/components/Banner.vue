<script setup lang="ts">
import type { Song } from '~/types'

const props = defineProps<{ items: any }>()
const router = useRouter()
const activeIndex = ref(0)
const isPaused = ref(false)
let timeout: NodeJS.Timeout

function mouseenter() {
  isPaused.value = true
}
function mouseleave() {
  isPaused.value = false
}

onMounted(() => {
  autoPlayCarousel(5000)
})

onBeforeUnmount(() => {
  clearTimeout(timeout)
})

function autoPlayCarousel(duration: number): void {
  timeout = setTimeout(() => {
    goNext()
    autoPlayCarousel(duration)
  }, duration)
}

watch(isPaused, (val) => {
  if (val) {
    clearTimeout(timeout)
  } else autoPlayCarousel(5000)
})
const nextIndex = computed(() => {
  let index = activeIndex.value + 1
  if (index > props.items.length - 1) index = 0
  return index
})

const previousIndex = computed(() => {
  let index = activeIndex.value - 1
  if (index < 0) index = props.items.length - 1
  return index
})

function goNext() {
  activeIndex.value = nextIndex.value
}
function goPrevious() {
  activeIndex.value = previousIndex.value
}

const song = ref<Song>()
const { execute } = useAsyncData(
  'song-info',
  () => getSongInfo(song.value!.encodeId),
  { immediate: false, watch: [song] },
)
function playBanner(item: any) {
  if (item.type === 1) {
    execute()
  }
  if (item.type === 4) {
    console.log(item.link) // /playlist/Doa-Hong-Nhac-Viet/ZA9U9FCI.html
    // router.push(item.link.split('.')[0])
  }
}
</script>

<template>
  <div
    class="slider-container relative"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <div class="slider">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="slider-item"
        :class="{
          next: index === nextIndex,
          prev: index === previousIndex,
          current: index === activeIndex,
        }"
      >
        <button class="inline-block" @click="playBanner(item)">
          <img :src="item.banner" alt="banner image" />
        </button>
      </div>
      <!-- dummy card placeholder for the height -->
      <div
        class="slider-item current pointer-events-none relative opacity-0"
        style="position: relative"
      >
        <a href="#" class="inline-block">
          <img :src="items[0].banner" alt="banner image" />
        </a>
      </div>
    </div>
    <button
      class="btn-move absolute left-0 top-1/2 z-30 flex -translate-y-1/2 transform items-center justify-center rounded-full bg-white bg-opacity-10 p-2 text-2xl text-white opacity-0 focus:outline-none"
      @click="goPrevious"
    >
      <i class="ic-go-left flex" />
    </button>
    <button
      class="btn-move absolute right-0 top-1/2 z-30 flex -translate-y-1/2 transform items-center justify-center rounded-full bg-white bg-opacity-10 p-2 text-2xl text-white opacity-0 focus:outline-none"
      @click="goNext"
    >
      <i class="ic-go-right flex" />
    </button>
  </div>
</template>

<style scoped>
.slider-container:hover .btn-move {
  opacity: 1;
}
.slider {
  @apply relative;
}

.slider-item {
  @apply absolute inset-x-0 m-auto w-[70%] translate-x-0 transform;
  transition: all 0.7s ease-out;
}

.slider-item.current {
  @apply z-20;
}

.slider-item.prev {
  @apply z-10 -translate-x-1/3 scale-75 transform;
}

.slider-item.next {
  @apply z-10 translate-x-1/3 scale-75 transform;
}

.slider-item:not(.next):not(.prev):not(.current) {
  @apply translate-x-0 scale-50 transform opacity-0;
}

@media screen and (min-width: 1000px) {
  .slider-item {
    width: 46%;
  }
  .slider-item.prev {
    transform: translateX(-65%) scale(0.85);
    width: 46%;
  }
  .slider-item.next {
    transform: translateX(65%) scale(0.85);
    width: 46%;
  }
}

.slider-item img {
  @apply h-auto w-full rounded-lg;
}
</style>
