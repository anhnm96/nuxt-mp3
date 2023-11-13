<script lang="ts">
// https://www.w3.org/TR/wai-aria-practices-1.2/examples/dialog-modal/dialog.html#
import type { InjectionKey, Ref } from 'vue'

// export modal context
interface ModalContext {
  labelledBy: Ref<string>
  describedBy: Ref<string>
}
const MODAL_SYMBOL = Symbol('Modal') as InjectionKey<ModalContext>
export const useModal = () => inject(MODAL_SYMBOL)!

export default defineComponent({
  name: 'Modal',
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    persistent: Boolean,
  },
  emits: ['close', 'update:modelValue'],
  setup(props, { emit }) {
    // context setup
    const labelledBy = ref()
    const describedBy = ref()
    provide(MODAL_SYMBOL, {
      labelledBy,
      describedBy,
    })
    // display logic
    const showModal = ref(false)
    const showContent = ref(false)
    const backdropLeaving = ref(false)
    const cardLeaving = ref(false)

    function close() {
      // start closing animation
      showContent.value = false
    }

    function onEscape(e: KeyboardEvent) {
      if (props.modelValue && e.key === 'Escape') {
        close()
      }
    }
    onMounted(() => {
      document.addEventListener('keydown', onEscape)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onEscape)
    })
    function show() {
      showModal.value = true
      showContent.value = true
    }

    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue) {
          show()
        } else {
          close()
        }
      },
      { immediate: true },
    )
    watch([backdropLeaving, cardLeaving], (newValues) => {
      if (newValues[0] === false && newValues[1] === false) {
        // close modal when leaving animation finished
        showModal.value = false
        emit('close')
        emit('update:modelValue', false)
      }
    })
    return {
      labelledBy,
      describedBy,
      showModal,
      showContent,
      backdropLeaving,
      cardLeaving,
      show,
      close,
    }
  },
})
</script>

<template>
  <div
    v-show="showModal"
    class="fixed inset-0 z-50 flex h-full w-full items-center justify-center"
  >
    <transition
      enter-active-class="transition-all duration-150 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      appear
      @before-leave="backdropLeaving = true"
      @after-leave="backdropLeaving = false"
    >
      <div
        v-if="showContent"
        class="absolute inset-0 bg-black bg-opacity-70"
        aria-hidden="true"
        @click="!persistent && close()"
      ></div>
    </transition>

    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="scale-75 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-75 opacity-0"
      appear
      @before-leave="cardLeaving = true"
      @after-leave="cardLeaving = false"
    >
      <div
        v-if="showContent"
        v-trap-focus
        class="relative"
        role="dialog"
        aria-modal="true"
        v-bind="$attrs"
        :tabindex="-1"
        :aria-labelledby="labelledBy"
        :aria-describedby="describedBy"
      >
        <slot :close="close" />
      </div>
    </transition>
  </div>
</template>
