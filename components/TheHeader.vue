<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const store = usePlayer()

const disableBack = computed(() => {
  if (process.server) return
  // use _path as dependency to force computed update
  const _path = route.path
  return window?.history.state.back === null
})

const disableForward = computed(() => {
  if (process.server) return
  // use _path as dependency to force computed update
  const _path = route.path
  return window?.history.state.forward === null
})

const { data: hotKeywords } = useAsyncData('hot-keyword', () =>
  getHotKeyword().then(({ data }) => data),
)

const searchTerm = ref<string>('')

const { data: suggestions, execute: execGetSuggestions } = useAsyncData(
  'suggestions',
  () =>
    getSuggestions(searchTerm.value).then(({ data }: any) => {
      const arr = [...data.items[0].keywords]
      if (data.items[1]) arr.push(...data.items[1].suggestions)
      return arr
    }),
  { immediate: false, default: () => [] },
)

watch(
  searchTerm,
  debounce((newValue) => {
    if (newValue === '') {
      suggestions.value = hotKeywords.value
      return
    }
    execGetSuggestions()
  }, 300),
  { immediate: true },
)

const selectedId = ref('')
useAsyncData(
  'song-info',
  () =>
    getSongInfo(selectedId.value).then(({ data }: any) => {
      store.setState({ prop: 'playlist', value: null })
      store.setState({ prop: 'currentSong', value: data })
    }),
  { watch: [selectedId], immediate: false },
)

function onSelect(item: any) {
  if (item.type === undefined || item.type === 0) {
    router.push({
      name: 'search-all',
      query: { q: item.keyword ? item.keyword : item },
    })
  }
  if (item.type === 1) selectedId.value = item.id
}

// adapter options for autocomplete input
function optionAdapter(item: any) {
  if (item.type === undefined) {
    return {
      id: item,
      label: item,
      value: item,
    }
  }
  if (item.type === 0) {
    return {
      id: item.keyword,
      label: item.keyword,
      value: item,
    }
  }
  return {
    id: item.id,
    label: item.title,
    value: item,
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-17 items-center space-x-2 bg-layout px-4 py-2 shadow-sm"
  >
    <div class="flex flex-shrink-0 items-center">
      <button
        class="flex items-center p-2 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disableBack"
        @click="$router.back()"
      >
        <i class="ic-back flex h-5 text-xl leading-normal text-primary" />
      </button>
      <button
        class="flex items-center p-2 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disableForward"
        @click="$router.forward()"
      >
        <i class="ic-forward flex h-5 text-xl leading-normal text-primary" />
      </button>
    </div>
    <div class="flex flex-auto">
      <div class="relative mr-auto w-full max-w-xl">
        <button
          class="absolute top-1/2 z-10 -translate-y-1/2 transform rounded-full p-2 outline-none transition hover:bg-alpha"
          aria-label="search"
        >
          <i class="ic-search flex h-5 text-xl text-secondary" />
        </button>
        <Autocomplete
          v-model:input="searchTerm"
          :options="suggestions"
          :option-adapter="optionAdapter"
          class="block w-full rounded-full border-none bg-alpha py-2 pl-10 pr-6 text-sm text-secondary outline-none focus:rounded-b-none focus:rounded-t-2xl focus:bg-primary"
          placeholder="Nhập tên bài hát, nghệ sĩ hoặc MV"
          menu-class="py-3 px-2.5 mt-0 rounded-b-lg bg-primary"
          :blur-on-select="true"
          @select="onSelect"
          @keydown.space.stop
        >
          <template #option="{ item, isActive, select }">
            <div
              v-if="item.value.type === 4"
              class="flex select-none items-center space-x-2 truncate rounded-md px-4 py-2 text-sm text-primary hover:bg-alpha"
              :class="isActive && 'bg-alpha'"
              @click.stop
            >
              <div class="flex space-x-2">
                <div class="h-10 w-10 flex-shrink-0">
                  <img
                    class="rounded-full"
                    :src="item.value.avatar"
                    :alt="item.value.name"
                  />
                </div>
                <div>
                  <p class="text-title">
                    {{ item.value.name }}
                  </p>
                  <p class="text-secondary">
                    Artist • {{ item.value.followers }} follows
                  </p>
                </div>
              </div>
            </div>
            <div
              v-else
              class="flex select-none items-center space-x-2 truncate rounded-md px-4 py-2 text-sm text-primary hover:bg-alpha"
              :class="isActive && 'bg-alpha'"
              @click="select(item)"
            >
              <template v-if="item.value.type === undefined">
                <i class="ic-search flex text-secondary" />
                <span>{{ item.label }}</span>
              </template>
              <template v-if="item.value.type === 0">
                <i class="ic-search flex text-secondary" />
                <span>{{ item.value.keyword }}</span>
              </template>
              <div v-if="item.value.type === 1" class="flex space-x-2">
                <div v-if="item.value.thumb" class="h-10 w-10 flex-shrink-0">
                  <img :src="item.value.thumb" :alt="item.value.title" />
                </div>
                <div>
                  <p class="text-title">
                    {{ item.value.title }}
                  </p>
                  <p class="text-secondary">
                    {{ item.value.artists[0].name }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </Autocomplete>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <button
        aria-label="select theme"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-alpha"
      >
        <svg class="h-5 w-5" viewBox="0 0 20 20">
          <defs>
            <linearGradient
              id="j32lhg93hd"
              x1="62.206%"
              x2="18.689%"
              y1="70.45%"
              y2="39.245%"
            >
              <stop offset="0%" stop-color="#F81212" />
              <stop offset="100%" stop-color="red" />
            </linearGradient>
            <linearGradient
              id="hjoavsus6g"
              x1="50%"
              x2="11.419%"
              y1="23.598%"
              y2="71.417%"
            >
              <stop offset="0%" stop-color="#00F" />
              <stop offset="100%" stop-color="#0031FF" />
            </linearGradient>
            <linearGradient
              id="la1y5u3dvi"
              x1="65.655%"
              x2="25.873%"
              y1="18.825%"
              y2="56.944%"
            >
              <stop offset="0%" stop-color="#FFA600" />
              <stop offset="100%" stop-color="orange" />
            </linearGradient>
            <linearGradient
              id="2dsmrlvdik"
              x1="24.964%"
              x2="63.407%"
              y1="8.849%"
              y2="55.625%"
            >
              <stop offset="0%" stop-color="#13EFEC" />
              <stop offset="100%" stop-color="#00E8DF" />
            </linearGradient>
            <filter
              id="4a7imk8mze"
              width="230%"
              height="230%"
              x="-65%"
              y="-65%"
              filterUnits="objectBoundingBox"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.9" />
            </filter>
            <filter
              id="301mo6jeah"
              width="312.7%"
              height="312.7%"
              x="-106.4%"
              y="-106.4%"
              filterUnits="objectBoundingBox"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.9" />
            </filter>
            <filter
              id="b2zvzgq7fj"
              width="295%"
              height="295%"
              x="-97.5%"
              y="-97.5%"
              filterUnits="objectBoundingBox"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.9" />
            </filter>
            <filter
              id="a1wq161tvl"
              width="256%"
              height="256%"
              x="-78%"
              y="-78%"
              filterUnits="objectBoundingBox"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.9" />
            </filter>
            <path
              id="qtpqrj1oda"
              d="M3.333 14.167V5.833l-1.666.834L0 3.333 3.333 0h3.334c.04 1.57.548 2.4 1.524 2.492l.142.008C9.403 2.478 9.958 1.645 10 0h3.333l3.334 3.333L15 6.667l-1.667-.834v8.334h-10z"
            />
            <path id="jggzvnjgfc" d="M0 0H20V20H0z" />
            <path
              id="2eiwxjmc7m"
              d="M3.333 14.167V5.833l-1.666.834L0 3.333 3.333 0h3.334c.04 1.57.548 2.4 1.524 2.492l.142.008C9.403 2.478 9.958 1.645 10 0h3.333l3.334 3.333L15 6.667l-1.667-.834v8.334h-10z"
            />
          </defs>
          <g fill="none" fill-rule="evenodd" transform="translate(2 3)">
            <mask id="tinejqaasb" fill="#fff">
              <use xlink:href="#qtpqrj1oda" />
            </mask>
            <use fill="#FFF" fill-opacity="0" xlink:href="#qtpqrj1oda" />
            <g mask="url(#tinejqaasb)">
              <g transform="translate(-2 -3)">
                <mask id="uf3ckvfvpf" fill="#fff">
                  <use xlink:href="#jggzvnjgfc" />
                </mask>
                <use fill="#D8D8D8" xlink:href="#jggzvnjgfc" />
                <circle
                  cx="8.9"
                  cy="6.8"
                  r="9"
                  fill="url(#j32lhg93hd)"
                  filter="url(#4a7imk8mze)"
                  mask="url(#uf3ckvfvpf)"
                />
                <circle
                  cx="9.3"
                  cy="13.7"
                  r="5.5"
                  fill="url(#hjoavsus6g)"
                  filter="url(#301mo6jeah)"
                  mask="url(#uf3ckvfvpf)"
                />
                <circle
                  cx="15.9"
                  cy="6.9"
                  r="6"
                  fill="url(#la1y5u3dvi)"
                  filter="url(#b2zvzgq7fj)"
                  mask="url(#uf3ckvfvpf)"
                />
                <circle
                  cx="16.4"
                  cy="17.7"
                  r="7.5"
                  fill="url(#2dsmrlvdik)"
                  filter="url(#a1wq161tvl)"
                  mask="url(#uf3ckvfvpf)"
                />
              </g>
            </g>
            <use fill="#FFF" fill-opacity="0.05" xlink:href="#2eiwxjmc7m" />
          </g>
        </svg>
      </button>
      <button
        aria-label="upload"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-alpha"
      >
        <i class="ic-upload flex h-5 w-5 text-xl text-secondary" />
      </button>
      <button
        aria-label="setting"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-alpha"
      >
        <i class="ic-settings flex h-5 w-5 text-xl text-secondary" />
      </button>
      <button
        aria-label="profile"
        class="relative h-11 w-11 overflow-hidden rounded-full border-2 border-yellow-400"
      >
        <img
          src="https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.9.85/static/media/user-default.3ff115bb.png"
          alt="logo"
          width="45"
        />
      </button>
    </div>
  </header>
</template>

<style>
.ic-vip {
  @apply absolute inset-x-0 bottom-0 mx-auto flex h-2.5 w-5 outline-none;
  background-image: url(https://zjs.zadn.vn/zmp3-desktop/releases/v1.0.25/static/media/vip-label.3dd6ac7e.svg);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
