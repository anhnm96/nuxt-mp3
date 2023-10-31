<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    progress: number
    min?: number
    max?: number
  }>(),
  {
    min: 0,
    max: 100,
  },
)
const emit = defineEmits(['update:progress'])
const progressElement = ref()
const progressDelta = computed(() => {
  return props.progress / props.max
})

function pointerdown() {
  document.addEventListener('pointermove', pointermove)
  document.addEventListener('pointerup', pointerup)
}

function pointermove(e: PointerEvent) {
  setProgress(e)
}

function clickOnProgressBar(e: MouseEvent) {
  setProgress(e)
}

function setProgress(e: MouseEvent) {
  const elWidth = progressElement.value.offsetWidth
  let progressWidth =
    e.clientX - progressElement.value.getBoundingClientRect().left
  if (progressWidth < 0) progressWidth = 0
  if (progressWidth > elWidth) progressWidth = elWidth
  emit('update:progress', (progressWidth / elWidth) * props.max)
}

function pointerup() {
  document.removeEventListener('pointermove', pointermove)
  document.removeEventListener('pointerup', pointerup)
}
</script>

<template>
  <div
    class="progress-bar"
    @pointerdown="pointerdown"
    @click="clickOnProgressBar"
  >
    <div ref="progressElement" class="progress-bg">
      <div class="progress" :style="{ width: `${progressDelta * 100}%` }" />
      <slot name="bar" />
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  @apply flex w-full cursor-pointer items-center;
  height: 15px;
}

.progress-bar:hover .progress-bg {
  height: 5px;
}

.progress-bg {
  @apply relative w-full rounded-full bg-progress;
  height: 3px;
}

.progress {
  @apply relative h-full rounded-full bg-progress-active;
}

.progress::after {
  @apply bg-progress-active;
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  right: -6px;
  top: -3px;
  opacity: 0;
}
.progress-bar:hover .progress::after {
  opacity: 1;
}
</style>
