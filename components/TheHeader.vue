<script setup lang="ts">
const route = useRoute()

const disableBack = computed(() => {
  // use _path as dependency to force computed update
  const _path = route.path
  return window.history.state.back === null
})

const disableForward = computed(() => {
  // use _path as dependency to force computed update
  const _path = route.path
  return window.history.state.forward === null
})
</script>

<template>
  <header
    class="h-17 bg-layout sticky top-0 z-20 flex items-center space-x-2 px-4 py-2 shadow-sm"
  >
    <div class="flex flex-shrink-0 items-center">
      <button
        class="flex items-center p-2 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disableBack"
        @click="$router.back()"
      >
        <i class="ic-back text-primary flex h-5 text-xl leading-normal" />
      </button>
      <button
        class="flex items-center p-2 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disableForward"
        @click="$router.forward()"
      >
        <i class="ic-forward text-primary flex h-5 text-xl leading-normal" />
      </button>
    </div>
    <div class="flex flex-auto">
      <div class="relative mr-auto w-full max-w-xl">
        <button
          class="hover:bg-alpha absolute top-1/2 z-10 -translate-y-1/2 transform rounded-full p-2 outline-none transition"
          aria-label="search"
        >
          <i class="text-secondary ic-search flex h-5 text-xl" />
        </button>
        <input
          type="text"
          class="focus:bg-primary text-secondary bg-alpha block w-full rounded-full border-none py-2 pl-10 pr-6 text-sm outline-none focus:rounded-b-none focus:rounded-t-2xl"
        />
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <button
        aria-label="select theme"
        class="bg-alpha flex h-10 w-10 items-center justify-center rounded-full"
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
        class="bg-alpha flex h-10 w-10 items-center justify-center rounded-full"
      >
        <i class="ic-upload text-secondary flex h-5 w-5 text-xl" />
      </button>
      <button
        aria-label="setting"
        class="bg-alpha flex h-10 w-10 items-center justify-center rounded-full"
      >
        <i class="ic-settings text-secondary flex h-5 w-5 text-xl" />
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
