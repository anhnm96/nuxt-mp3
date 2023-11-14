import type { Component, VNode } from 'vue'
import { createApp, createVNode, ref } from 'vue'
import DefaultNotification from './DefaultNotification.vue'
import NotificationContainer from './NotificationContainer.vue'
import type { ToastOptions } from './types'

export const notifications = ref({
  'top-left': [] as VNode[],
  'top-right': [] as VNode[],
  'bottom-left': [] as VNode[],
  'bottom-right': [] as VNode[],
  'top-center': [] as VNode[],
  'bottom-center': [] as VNode[],
})

const defaultOptions: ToastOptions = {
  type: 'info',
  position: 'top-right',
  timeout: 5000,
  showProgressbar: true,
}

let newId = 0
let parentEl: HTMLDivElement

function mergeOptions(options: Partial<ToastOptions> = {}): ToastOptions {
  let mergedOptions: ToastOptions | null = {
    ...defaultOptions,
    ...options,
    id: newId,
    key: newId,
  }

  mergedOptions.onClose = (payload) => {
    const removeIndex = notifications.value[mergedOptions!.position!].findIndex(
      (n) => n.props?.id === mergedOptions!.id,
    )

    // @ts-expect-error
    notifications.value[mergedOptions.position][removeIndex].result(payload)
    notifications.value[mergedOptions!.position!].splice(removeIndex, 1)
    // release from memory
    mergedOptions = null
  }

  return mergedOptions
}
export function show(
  options: ToastOptions,
  component: Component = DefaultNotification,
) {
  const mergedOptions = mergeOptions(options)
  // @ts-expect-error
  const toastVNode = createVNode(component, mergedOptions)
  notifications.value[mergedOptions.position!].push(toastVNode)

  if (!parentEl) {
    parentEl = document.createElement('div')
    document.body.appendChild(parentEl)
    createApp(NotificationContainer).mount(parentEl)
  }
  newId++

  return new Promise((resolve) => {
    // @ts-expect-error
    toastVNode.result = resolve // we'll call resolve in onClose function
  })
}
