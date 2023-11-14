import { onUnmounted, ref } from 'vue'

function useTimer(callback: () => any = () => {}, delay: number) {
  let timeoutId: NodeJS.Timeout
  let intervalId: NodeJS.Timeout
  let startTime: number
  let endTime: number
  let remainingTime = delay

  const progress = ref(100)

  const stop = () => {
    clearInterval(intervalId)
    clearTimeout(timeoutId)
    remainingTime -= Date.now() - startTime
  }

  const clear = () => {
    clearInterval(intervalId)
    clearTimeout(timeoutId)
  }

  const start = () => {
    startTime = Date.now()
    endTime = Date.now() + remainingTime
    intervalId = setInterval(() => {
      progress.value = ((endTime - Date.now()) / delay) * 100
    }, 20)
    timeoutId = setTimeout(() => {
      callback()
      clear()
    }, remainingTime)
  }

  onUnmounted(() => {
    clear()
  })

  return { start, stop, clear, progress }
}

export default useTimer
