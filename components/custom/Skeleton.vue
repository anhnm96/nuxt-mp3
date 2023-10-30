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
    cssClass: 'bg-neutral-500 rounded',
    auto: false,
    range: () => ({
      min: 20,
      max: 100,
    }),
    animate: true,
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
    class="overflow-hidden"
    :class="[cssClass, { 'animate-pulse': animate }]"
    :style="{ width: auto === true ? width : '' }"
  >
    <slot />
  </div>
</template>
