<script lang="ts" setup>
import type { Pausable, Position } from '@vueuse/core'
import { CarouselKey } from './keys'

const props = defineProps({
  initialIndex: {
    type: Number,
    default: 0,
  },
  repeat: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Number,
    required: false,
    validator(value: number) {
      return value >= 0
    },
  },
  itemsClass: {
    type: String,
    default: 'overflow-x-auto w-full flex',
  },
  itemsToList: {
    type: Number,
    default: -1,
  },
})

const dragging = ref(false)
const activeIndex = ref(props.initialIndex)
const elRef = ref<HTMLElement>()
const startX = ref()
const slideX = ref()
const delta = ref(0)
const itemWidth = ref(0)
// provide setup
const items = ref<HTMLDivElement[]>([])
function addItem(item: any) {
  items.value.push(item)
}

provide(CarouselKey, { addItem })

// functions
const eventMoveType = ref('')
const eventEndType = ref('')
let startPosition: Position
let endPosition: Position
function pointerStart(e: PointerEvent) {
  dragging.value = true
  if (e.pointerType === 'mouse') {
    eventMoveType.value = 'pointermove'
    eventEndType.value = 'pointerup'
  } else {
    eventMoveType.value = 'touchmove'
    eventEndType.value = 'touchend'
  }
  if (eventEndType.value === 'pointerup')
    startPosition = { x: e.clientX, y: e.clientY }
  elRef.value?.classList.remove('scroll-snap')
  // stop animation
  elRef.value!.scrollLeft = elRef.value!.scrollLeft
  slideX.value = elRef.value!.scrollLeft
  startX.value = e.clientX
  window.addEventListener(eventMoveType.value, pointerMove)
  window.addEventListener(eventEndType.value, pointerUp)
}

function pointerMove(e: any) {
  const x = e.touches
    ? (e.changedTouches[0] || e.touches[0]).clientX
    : e.clientX
  delta.value = startX.value - x

  elRef.value!.scrollLeft = slideX.value + delta.value
}

function pointerUp(e: any) {
  if (eventEndType.value === 'pointerup')
    endPosition = { x: e.clientX, y: e.clientY }
  dragging.value = false
  window.removeEventListener(eventMoveType.value, pointerMove)
  window.removeEventListener(eventEndType.value, pointerUp)
  if (delta.value !== 0) {
    const signCheck = Math.sign(delta.value)
    const results = Math.round(Math.abs(delta.value / itemWidth.value) + 0.15) // Hack
    scrollTo(activeIndex.value + signCheck * results)
    delta.value = 0
  } else {
    /**
     * make sure to finish scrolling in case of
     * clicking while sliding
     */
    scrollTo(activeIndex.value)
  }
}

let intervalFn: Pausable
if (props.autoplay) {
  intervalFn = useIntervalFn(() => {
    scrollTo(activeIndex.value + 1)
  }, props.autoplay)
}

function mouseEnter() {
  if (props.autoplay) {
    intervalFn!.pause()
  }
}

function mouseLeave() {
  if (props.autoplay) {
    intervalFn!.resume()
  }
}

let scrollTimeout: NodeJS.Timeout
function onScrollFinished() {
  if (dragging.value) return
  clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    const newIndex = Math.round(elRef.value!.scrollLeft / itemWidth.value)
    activeIndex.value = newIndex
    /**
     * scroll-snap breaks animation
     * so we need to wait until animation end
     */
    /**
     * we still need to check for dragging in case of
     * @pointerup then @pointerdown immediately
     */
    if (!dragging.value) elRef.value!.classList.add('scroll-snap')
  }, 100)
}

onMounted(() => {
  scrollTo(activeIndex.value)
  // this is used to update activeIndex when scrolling horizontally
  elRef.value?.addEventListener('scroll', onScrollFinished)
})

onBeforeUnmount(() => {
  window.removeEventListener(eventMoveType.value, pointerMove)
  window.removeEventListener(eventEndType.value, pointerUp)
  elRef.value?.removeEventListener('scroll', onScrollFinished)
})

const itemsToShow = computed(() => {
  if (!elRef.value) return 0
  return Math.round(elRef.value.getBoundingClientRect().width / itemWidth.value)
})

function scrollTo(index: number) {
  if (
    index === items.value.length ||
    (itemsToShow.value > 1 && index > items.value.length - itemsToShow.value)
  ) {
    if (props.repeat || props.autoplay) index = 0
    else return
  } else if (index < 0) {
    if (props.repeat || props.autoplay) index = items.value.length - 1
    else return
  }
  clearTimeout(scrollTimeout)
  elRef.value?.scrollTo({
    left: index * itemWidth.value,
    behavior: 'smooth',
  })
  activeIndex.value = index
}

const hasPrev = computed(() => {
  return activeIndex.value > 0
})

const hasNext = computed(() => {
  return activeIndex.value < items.value.length - itemsToShow.value
})

function prev() {
  // check if items are enough to slide
  if (items.value.length < itemsToShow.value) return
  if (!hasPrev.value && props.repeat) {
    scrollTo(items.value.length - itemsToShow.value)
    return
  }

  const gap = props.itemsToList === -1 ? itemsToShow.value : props.itemsToList
  activeIndex.value -= gap
  if (activeIndex.value < 0) activeIndex.value = 0
  scrollTo(activeIndex.value)
}

function next() {
  // check if items are enough to slide
  if (items.value.length < itemsToShow.value) return
  if (!hasNext.value && props.repeat) {
    scrollTo(0)
    return
  }

  const lastAllowIndex = items.value.length - itemsToShow.value
  const gap = props.itemsToList === -1 ? itemsToShow.value : props.itemsToList
  const nextActiveIndex = activeIndex.value + gap
  // make sure we don't over translateX
  if (nextActiveIndex > lastAllowIndex) {
    activeIndex.value = lastAllowIndex
    scrollTo(activeIndex.value)
    return
  }
  activeIndex.value = nextActiveIndex
  scrollTo(activeIndex.value)
}

function refresh() {
  // console.log('refresh', items.value[0])
  itemWidth.value = items.value[0].getBoundingClientRect().width
  // make sure we don't over translateX
  if (activeIndex.value > items.value.length - itemsToShow.value)
    activeIndex.value = items.value.length - itemsToShow.value
  // fallback check in case of carouselItems.length < itemsToShow
  if (activeIndex.value < 0) activeIndex.value = 0
  scrollTo(activeIndex.value)
}
let observer: ResizeObserver
onMounted(() => {
  observer = new ResizeObserver(refresh)
  observer.observe(elRef.value!)
})

onBeforeUnmount(() => {
  observer.disconnect()
})

function clickCarousel(e: Event) {
  // Prevent click event on <a> tag if we dragged carousel
  if (
    startPosition?.x !== endPosition?.x ||
    startPosition?.y !== endPosition?.y
  ) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }
}
</script>

<template>
  <div @mouseenter="mouseEnter" @mouseleave="mouseLeave">
    <slot
      name="header"
      :active-index="activeIndex"
      :prev="prev"
      :next="next"
      :has-prev="hasPrev"
      :has-next="hasNext"
    />
    <div
      ref="elRef"
      class="carousel scroll-snap"
      :class="itemsClass"
      @pointerdown="pointerStart"
      @click.capture="clickCarousel"
    >
      <slot
        :active-index="activeIndex"
        :scroll-to="scrollTo"
        :prev="prev"
        :next="next"
      />
    </div>
  </div>
</template>

<style scoped>
.carousel {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.carousel::-webkit-scrollbar {
  display: none;
}

.scroll-snap {
  scroll-snap-type: x mandatory;
}
</style>
