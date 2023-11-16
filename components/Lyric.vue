<script setup lang="ts">
import Karaoke from './Karaoke.vue'
import { PlayerState } from '@/types'
import type { Lyric } from '@/types'

enum Tab {
  Lyric = 'LYRIC',
  Karaoke = 'KARAOKE',
}

const tab = ref<Tab>(Tab.Lyric)
const store = usePlayer()
const sentences = ref<Lyric[]>([])

const {
  data: lyricData,
  execute: fetchLyricData,
  status,
} = useAsyncData(
  'get-lyric',
  () =>
    getLyric(store.currentSong.encodeId).then(({ data }) => {
      if (data.file) {
        $fetch(data.file, { parseResponse: (txt) => txt }).then((lyric) => {
          sentences.value = lyricParser(lyric)
        })
      }
      return data
    }),
  { immediate: false },
)

watch(
  () => store.currentSong,
  () => {
    fetchLyricData()
  },
  { immediate: true },
)
// transition background images
let timeBg: NodeJS.Timeout
const showBgAbove = ref(true)
const bgIndexes = reactive({ above: 0, bellow: 1 })
function animationEnd(_key: 'above' | 'bellow') {
  timeBg = setTimeout(() => {
    showBgAbove.value = !showBgAbove.value
  }, 1500)
}

function disappeared(key: 'above' | 'bellow') {
  if (bgIndexes[key] + 2 < lyricData.value?.defaultIBGUrls.length)
    bgIndexes[key] += 2
  else bgIndexes[key] = key === 'above' ? 0 : 1
}

const bgImageAbove = computed(
  () => lyricData.value?.defaultIBGUrls[bgIndexes.above],
)
const bgImageBellow = computed(
  () => lyricData.value?.defaultIBGUrls[bgIndexes.bellow],
)

// toggle style var
onActivated(() => {
  document.body.style.setProperty('--player-text', '#fff')
})

onDeactivated(() => {
  document.body.style.removeProperty('--player-text')
})

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

let timeout: NodeJS.Timeout

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  clearTimeout(timeout)
  clearTimeout(timeBg)
})

const currentSentenceIndex = ref(0)

function updateCurrentIndex() {
  const seek = store.howler.seek()
  currentSentenceIndex.value = sentences.value.findIndex((sentence, index) => {
    const nextSentence = sentences.value[index + 1]
    if (nextSentence) return seek >= sentence.time && seek < nextSentence.time
    return seek >= sentence.time
  })
  timeout = setTimeout(updateCurrentIndex, 200)
}

watch(currentSentenceIndex, (val) => {
  const el = document.getElementById(`sentence-${val}`)
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }
})

// initially we watch store.seek to update
// currentSentenceIndex but it was slow to sync
// with playing sound.
watch(
  () => store.playerState,
  (val) => {
    if (val === PlayerState.PLAYING) updateCurrentIndex()
    else clearTimeout(timeout)
  },
  { immediate: true },
)

function seekLyric(time: number) {
  store.howler.seek(time)
}
</script>

<template>
  <transition name="slide" appear>
    <div class="fixed inset-0 z-40 bg-primary pb-20">
      <!-- background images -->
      <div class="absolute inset-0 isolate bg-[color:var(--alpha-layout-bg)]">
        <div class="opacity-50" :class="{ paused: !store.isPlaying }">
          <transition
            name="fade"
            type="transition"
            @after-leave="disappeared('above')"
          >
            <img
              v-show="showBgAbove"
              :src="bgImageAbove"
              alt="background1"
              class="animate-enter absolute inset-0 z-10 h-full w-full object-cover object-center"
              @animationend="animationEnd('above')"
            />
          </transition>
          <transition
            name="fade"
            type="transition"
            @after-leave="disappeared('bellow')"
          >
            <img
              v-show="!showBgAbove"
              :src="bgImageBellow"
              alt="background2"
              class="animate-enter absolute inset-0 h-full w-full object-cover object-center"
              @animationend="animationEnd('bellow')"
            />
          </transition>
        </div>
      </div>
      <div class="isolate flex h-full flex-col justify-between pt-5">
        <!-- header -->
        <div class="relative flex items-center">
          <!-- center -->
          <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          >
            <div class="flex rounded-full bg-blur p-0.5">
              <button
                class="flex-1 rounded-full px-12 py-1.5 text-base font-semibold text-white text-opacity-50 focus:outline-none"
                :class="
                  tab === Tab.Karaoke &&
                  'bg-tab-active bg-opacity-100  text-opacity-100'
                "
                @click="tab = Tab.Karaoke"
              >
                Karaoke
              </button>
              <button
                class="flex-1 rounded-full px-12 py-1.5 text-base font-semibold text-white text-opacity-50 focus:outline-none"
                :class="
                  tab === Tab.Lyric &&
                  'bg-tab-active bg-opacity-100 text-opacity-100'
                "
                @click="tab = Tab.Lyric"
              >
                Lyric
              </button>
            </div>
          </div>
          <!-- right -->
          <div class="ml-auto mr-5 flex space-x-4">
            <button
              class="flex h-12 w-12 items-center justify-center rounded-full bg-blur text-xl text-white"
            >
              <i class="ic-settings flex" />
            </button>
            <button
              class="flex h-12 w-12 items-center justify-center rounded-full bg-blur text-xl text-white"
              @click="store.toggleShowLyric()"
            >
              <i class="ic-go-down flex" />
            </button>
          </div>
        </div>
        <!-- content -->
        <div v-if="status === 'pending'" class="flex justify-center">
          <Spinner />
        </div>
        <template v-if="status === 'success'">
          <div
            v-show="tab === Tab.Lyric"
            class="mx-auto flex w-4/5 max-w-5xl gap-8"
          >
            <div class="hidden w-2/5 max-w-lg lg:flex lg:items-center">
              <img
                class="w-full rounded-lg"
                :src="store.currentSong.thumbnailM"
                alt="thumbnail"
              />
            </div>
            <!-- lyric -->
            <div
              class="hide-scrollbar flex-1 overflow-y-auto text-center lg:text-left"
              style="max-height: 500px"
            >
              <div
                v-for="(sentence, index) in sentences"
                :id="`sentence-${index}`"
                :key="`${index}-${sentence.content.trim()}`"
                class="cursor-pointer rounded-lg p-5 text-4xl font-bold text-white hover:bg-alpha"
                :class="[
                  currentSentenceIndex === index &&
                    'bg-alpha text-purple-primary',
                  currentSentenceIndex > index && 'text-opacity-50',
                ]"
                @click="seekLyric(sentence.time)"
              >
                {{ sentence.content }}
              </div>
            </div>
          </div>
          <keep-alive>
            <Karaoke
              v-if="tab === Tab.Karaoke"
              :sentences="lyricData.sentences"
            />
          </keep-alive>
        </template>
        <!-- player -->
        <div class="text-center">
          <span class="text-sm font-bold text-player">{{
            store.currentSong.title
          }}</span>
          <span class="text-sm text-player opacity-50">
            - {{ store.currentSong.artistsNames }}</span
          >
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.slide-enter-from,
.slide-leave-to {
  transform: translateY(90%);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.7s ease-out;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.paused img {
  animation-play-state: paused;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s ease;
}

.animate-enter {
  animation: animateEnter 10s linear forwards;
}

@keyframes animateEnter {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
