<script setup lang="ts">
interface RandomRange {
  min: number
  max: number
}
const props = withDefaults(
  defineProps<{
    cssClass?: string
    auto?: boolean
    range?: RandomRange
  }>(),
  {
    cssClass: 'bg-neutral-800 rounded',
    auto: false,
    range: () => ({
      min: 20,
      max: 100,
    }),
  },
)

const width = computed(() => {
  return `${Math.floor(
    Math.random() * (props.range.max - props.range.min) + props.range.min,
  )}%`
})
</script>

<template>
  <div
    aria-hidden="true"
    class="animate-pulse overflow-hidden"
    :class="[cssClass]"
    :style="{ width: auto === true ? width : '' }"
  >
    <slot />
  </div>
</template>
