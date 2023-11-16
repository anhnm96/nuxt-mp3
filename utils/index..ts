import type { Lyric, Sentence } from '@/types'

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

export function getRandomUUID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15)
}

// [00:14.17] Trăng soi trong đêm mây trôi lặng thầm
// [00:17.62] Bên thềm nhà gió nhẹ nhàng
// [
//   {time: 14, content: 'Trăng soi trong đêm mây trôi lặng thầm'},
//   {time: 17, content: 'Bên thềm nhà gió nhẹ nhàng'}
// ]
export function lyricParser(lrc: string): Lyric[] {
  const lyrics = lrc.split('\n')
  const lrcObj = []
  for (let i = 0; i < lyrics.length; i++) {
    const lyric = decodeURIComponent(lyrics[i])
    const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g
    const timeRegExpArr = lyric.match(timeReg)
    if (!timeRegExpArr) continue
    const content = lyric.replace(timeReg, '')
    for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
      const t = timeRegExpArr[k]
      const min = Number(String(t.match(/\[\d*/i)).slice(1))
      const sec = Number(String(t.match(/:\d*/i)).slice(1))
      const time = min * 60 + sec
      if (content !== '') {
        lrcObj.push({ time, content })
      }
    }
  }
  return lrcObj
}

// karaoke
const fadeout = 0.4
const fadein = 0.4

export function normalize(sentences: Sentence[] = [], context: any) {
  context.font = 'bold 50px sans-serif'
  const n = sentences.length - 1
  const _sections: any = []
  let _sentences: any = []
  let preEnd = 0
  let setenceIndex = 0

  sentences.forEach((sentence, index) => {
    const sentenceText = sentence.words
      .reduce((results, value) => `${results + value.data} `, '')
      .trim()

    if (!sentenceText) {
      return
    }

    const sentenceTextWidth = context.measureText(sentenceText).width

    let wordText = ''
    const words = sentence.words.map((word) => {
      const startAt = context.measureText(wordText).width / sentenceTextWidth
      const perInSentence =
        context.measureText(word.data).width / sentenceTextWidth
      wordText = `${wordText + word.data} `

      return {
        start: word.startTime,
        end: word.endTime,
        duration: word.endTime - word.startTime,
        text: word.data,
        startAt,
        perInSentence,
      }
    })

    const start = sentence.words[0].startTime
    const end = sentence.words[sentence.words.length - 1].endTime
    const preSentence = _sentences[index - 1]

    if (preSentence && start < preSentence.end) {
      preSentence.end = start
    }

    let countdown
    if (start - preEnd > 10000) {
      const items = [1, 2, 3].map((count) => ({
        count,
        start: start - 1000 * (count + 1),
        end: start - 1000 * count,
      }))

      countdown = {
        items,
        sentenceTextWidth,
      }
    }

    preEnd = end

    if (_sentences.length && countdown) {
      _sections.push({
        sentences: _sentences,
        start: _sentences[0].start,
        end: _sentences[_sentences.length - 1].end,
      })
      _sentences = []
      setenceIndex = 0
    }

    _sentences.push({
      index: setenceIndex,
      start,
      end,
      duration: end - start,
      text: sentenceText,
      words,
      alpha: 1,
      countdown,
    })
    setenceIndex++

    if (index === n) {
      _sections.push({
        sentences: _sentences,
        start: _sentences[0].start,
        end: _sentences[_sentences.length - 1].end,
      })
    }
  })

  return _sections
}

export function buildSentences(sections: any, time: number) {
  const section = sections.find((section: any) => time < section.end)
  return findSentences(section, time)
}

function findSentences({ sentences = [], start, end }: any = {}, time: number) {
  const n = sentences.length
  let _sentences: any = []
  if (!n || start - time > 6000 || time > end) {
    return _sentences
  }

  if (time < sentences[1]?.start) {
    _sentences = sentences.slice(0, 2)
    _sentences.forEach((i: any) => (i.alpha = 1))
    return _sentences
  }

  if (time > sentences[n - 2]?.end) {
    _sentences = sentences.slice(n - 2)
    _sentences.forEach((i: any) => (i.alpha = 1))
    return _sentences
  }

  for (let i = 0; i < n; i++) {
    const sentence = sentences[i]

    if (time >= sentence.start && time < sentence.end) {
      _sentences.push(sentence)
      const deta = (time - sentence.start) / sentence.duration

      if (deta <= fadeout) {
        const preSentence = sentences[i - 1]
        if (preSentence) {
          const alpha = 1 - deta / fadeout
          preSentence.alpha = alpha
          _sentences.push(preSentence)
        }
        break
      }

      if (deta >= fadein) {
        const nextSentence = sentences[i + 1]
        if (nextSentence) {
          const alpha = (deta - fadein) / fadein
          nextSentence.alpha = alpha
          _sentences.push(nextSentence)
        }
        break
      }
      break
    }

    if (time < sentence.end) {
      _sentences.push(sentence)
      _sentences.push(sentences[i - 1])
      _sentences.forEach((i: any) => (i.alpha = 1))
      break
    }
  }
  return _sentences
}
