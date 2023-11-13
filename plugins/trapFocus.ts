function findFocusable(element: HTMLElement, programmatic = false) {
  if (!element) {
    return null
  }
  if (programmatic) {
    return element.querySelectorAll<HTMLElement>(`*[tabindex="-1"]`)
  }
  return element.querySelectorAll<HTMLElement>(`a[href]:not([tabindex="-1"]),
                                   area[href],
                                   input:not([disabled]),
                                   select:not([disabled]),
                                   textarea:not([disabled]),
                                   button:not([disabled]),
                                   iframe,
                                   object,
                                   embed,
                                   *[tabindex]:not([tabindex="-1"]),
                                   *[contenteditable]`)
}

let initialFocusedElement: HTMLElement
let onKeyDown: (event: KeyboardEvent) => void

function beforeMount(el: HTMLElement, { value = true }) {
  if (value) {
    initialFocusedElement = document.activeElement as HTMLElement
    let focusable = findFocusable(el)
    let focusableProg = findFocusable(el, true)

    if (!!focusable && focusable.length > 0) {
      onKeyDown = (event: KeyboardEvent) => {
        // Need to get focusable each time since it can change between key events
        // ex. changing month in a datepicker
        focusable = findFocusable(el)
        focusableProg = findFocusable(el, true)
        if (!focusable) return
        const firstFocusable = focusable[0]
        const lastFocusable = focusable[focusable.length - 1]

        if (
          event.target === firstFocusable &&
          event.shiftKey &&
          event.key === 'Tab'
        ) {
          event.preventDefault()
          lastFocusable.focus()
        } else if (
          (event.target === lastFocusable ||
            Array.from(focusableProg || []).includes(
              event.target as HTMLElement,
            )) &&
          !event.shiftKey &&
          event.key === 'Tab'
        ) {
          event.preventDefault()
          firstFocusable.focus()
        }
      }
      el.addEventListener('keydown', onKeyDown)
    }
  }
}

function mounted(el: HTMLElement) {
  el.focus()
}

function beforeUnmount(el: HTMLElement) {
  initialFocusedElement.focus()
  el.removeEventListener('keydown', onKeyDown)
}

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return nuxtApp.vueApp.directive('trapFocus', {})
  nuxtApp.vueApp.directive('trapFocus', {
    beforeMount,
    mounted,
    beforeUnmount,
  })
})
