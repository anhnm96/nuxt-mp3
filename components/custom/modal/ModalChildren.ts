import { useModal } from './Modal.vue'

// eslint-disable-next-line vue/one-component-per-file
export const ModalTitle = defineComponent({
  name: 'ModalTitle',
  props: {
    as: {
      type: String,
      default: 'h2',
    },
  },
  setup(props, { slots }) {
    const id = `ModalTitle-${getRandomUUID()}`
    const { labelledBy } = useModal()
    labelledBy.value = id

    return () =>
      h(
        props.as,
        {
          id,
        },
        slots.default?.(),
      )
  },
})

// eslint-disable-next-line vue/one-component-per-file
export const ModalContent = defineComponent({
  name: 'ModalContent',
  setup(_, { slots }) {
    const id = `ModalContent-${getRandomUUID()}`
    const { describedBy } = useModal()
    describedBy.value = id

    return () => h('div', { id }, slots.default?.())
  },
})
