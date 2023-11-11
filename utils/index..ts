export function shuffle(array: any[]) {
  const newArr: any[] = [...array]
  for (let i = newArr.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]]
  }
  return newArr
}

export function displayDuration(sec: number, type = 1) {
  const format = (val: number) => `0${Math.floor(val)}`.slice(-2)
  const hours = sec / 3600
  const minutes = (sec % 3600) / 60
  const seconds = sec % 60
  if (type === 1) {
    if (format(hours) !== '00') {
      return `${format(hours)} giờ ${format(minutes)} phút`
    } else {
      return `${format(minutes)} phút`
    }
  }
  if (type === 2) {
    return [format(minutes), format(seconds)].join(':')
  }
  return ''
}

export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60) || 0
  const seconds = Math.round(time - minutes * 60 || 0)

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export function debounce(func: (...args: any) => void, delay = 0) {
  let timer: NodeJS.Timeout
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      func.apply(this, args)
    }, delay)
  }
}
