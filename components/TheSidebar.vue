<script setup lang="ts">
const nav1 = [
  { text: 'Cá Nhân', iconClass: 'ic-library' },
  { text: 'Khám Phá', iconClass: 'ic-mn-home' },
  { text: '#zingchart', iconClass: 'ic-mn-zingchart' },
  { text: 'Theo Dõi', iconClass: 'ic-feed' },
]
const nav2 = [
  { text: 'Nhạc Mới', iconClass: 'ic-mn-song' },
  { text: 'Thể Loại', iconClass: 'ic-mn-catalogue' },
  { text: 'Top 100', iconClass: 'ic-mn-top100' },
  { text: 'MV', iconClass: 'ic-mn-mv' },
]

const show = ref(false)
const transitioning = ref(false)
const expanded = ref(false)

function toggleExpand() {
  show.value = !show.value
  transitioning.value = true
}

function transitionEnd() {
  expanded.value = show.value
  transitioning.value = false
}
</script>

<template>
  <div class="w-17 relative flex-shrink-0 transition-all duration-300 lg:w-64">
    <button
      v-if="show"
      class="fixed inset-0 z-30 h-full w-full cursor-default bg-transparent lg:hidden"
      aria-label="collapse"
      @click="toggleExpand"
    />
    <aside
      class="bg-sidebar-popup lg:bg-sidebar absolute inset-0 z-30 h-full transition-all duration-300 lg:relative lg:w-full"
      :class="[show ? 'w-64' : 'w-17', { transitioning, expanded }]"
      @transitionend="transitionEnd"
    >
      <div
        class="logo-wrapper h-17 flex items-center justify-center overflow-hidden lg:justify-start lg:px-6"
      >
        <NuxtLink to="/">
          <div class="logo" />
        </NuxtLink>
      </div>
      <nav>
        <ul>
          <li
            v-for="(nav, index) in nav1"
            :key="nav.text"
            :class="{ 'link-active': index === 1 }"
          >
            <a
              href="#"
              class="hover:text-item-hover text-navigation flex items-center justify-center space-x-3 px-6 py-4 font-semibold lg:justify-start lg:py-2.5"
            >
              <i :class="nav.iconClass" class="flex h-6 text-2xl" />
              <span
                class="hidden truncate text-sm font-semibold leading-normal lg:block"
                >{{ nav.text }}</span
              >
            </a>
          </li>
        </ul>
      </nav>
      <div class="mx-6 my-3 bg-gray-400" style="height: 1px" />
      <nav>
        <ul>
          <li v-for="nav in nav2" :key="nav.text">
            <a
              href="#"
              class="hover:text-item-hover text-navigation flex items-center justify-center space-x-3 px-6 py-4 font-semibold lg:justify-start lg:py-2.5"
            >
              <i :class="nav.iconClass" class="flex h-6 text-2xl" />
              <span
                class="hidden truncate text-sm font-semibold leading-normal lg:block"
                >{{ nav.text }}</span
              >
            </a>
          </li>
        </ul>
      </nav>
      <button
        class="hover:text-item-hover text-primary bg-alpha absolute bottom-2 right-4 flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
        @click="toggleExpand"
      >
        <i class="flex" :class="[show ? 'ic-go-left' : 'ic-go-right']" />
      </button>
    </aside>
  </div>
</template>

<style>
aside:is(.transitioning, .expanded) .logo-wrapper {
  @apply justify-start px-6;
}

.logo {
  width: 45px;
  height: 45px;
  display: inline-block;
  background: url(https://zjs.zadn.vn/zmp3-desktop/releases/v1.2.10/static/media/icon_zing_mp3_60.f6b51045.svg);
}

aside:is(.transitioning, .expanded) .logo {
  background: var(--img-logo-mp3) 50% / contain no-repeat;
  width: 120px;
  height: 40px;
}

aside:is(.transitioning, .expanded) li a {
  justify-content: flex-start;
}

aside:is(.transitioning, .expanded) li a span {
  display: block;
}

.link-active {
  @apply bg-alpha border-purple-primary border-l-2;
}

.link-active a {
  @apply text-item-hover;
}

@media screen and (min-width: 1024px) {
  .logo {
    width: 120px;
    height: 40px;
    background: var(--img-logo-mp3) 50% / contain no-repeat;
    /* background-position: 50%;
    background-size: contain; */
  }
}
</style>
