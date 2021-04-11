<template>
  <div id="nav" class="fixed top-0 w-full z-10 flex sm:flex-col items-center text-nord4 bg-nord0 border-b border-nord1">
    <div class="nav-item block text-sm mr-auto pl-2">
      <span v-if="$route.path == '/' || $route.path == '/ja/'" class="site-name text-xl font-semibold block cursor-pointer p-4">
        memorandum
      </span>
      <router-link v-else :to="localePath('/')" class="site-name text-xl font-semibold hover:no-underline block cursor-pointer text-nord4 p-4">
        memorandum
      </router-link>
    </div>
    <div class="nav-item block text-sm sm:hidden">
      <div class="p-4">
        <NuxtLink :to="localePath('/tags')" class="text-nord4">
          {{ $t('tags') }}
        </NuxtLink>
      </div>
    </div>
    <div class="nav-item dropdown p-0 group block text-sm sm:hidden">
      <div class="dropdown-btn p-4 cursor-pointer">
        {{ $t('language') }}
        <icon-arrow-dropdown classes="text-nord4" />
      </div>
      <div class="dropdown-content bg-nord1 absolute right-0 hidden rounded group-hover:block sm:relative sm:rounded-none p-4">
        <div class="p-2 w-full">
          <NuxtLink v-if="hasEnglish" :to="switchLocalePath('en')" class="text-nord4">
            English
          </NuxtLink>
          <span v-else class="text-nord3-light">
            English
          </span>
        </div>
        <div class="p-2 w-full">
          <NuxtLink :to="switchLocalePath('ja')" class="text-nord4">
            Japanese
          </NuxtLink>
        </div>
      </div>
    </div>
    <div id="toggleMenu" class="menu hidden sm:block absolute right-0 top-0 p-4 cursor-pointer">
      <div class="bar1 w-4 h-0.5 bg-nord4 mx-0 my-1 duration-300" />
      <div class="bar2 w-4 h-0.5 bg-nord4 mx-0 my-1 duration-300" />
      <div class="bar3 w-4 h-0.5 bg-nord4 mx-0 my-1 duration-300" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasEnglish: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
#nav {
  .nav-item {
    .site-name {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
  }
}
@media screen and (max-width: 639px) {
  #nav {
    .menu {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    &.is-open {
      .nav-item:not(:first-child) {
        display: block;
        width: 100%;
      }
      .menu {
        .bar1 {
          -webkit-transform: rotate(-45deg) translate(-4px, 3px);
          transform: rotate(-45deg) translate(-4px, 3px);
        }
        .bar2 {
          opacity: 0;
        }
        .bar3 {
          -webkit-transform: rotate(45deg) translate(-5px, -5px);
          transform: rotate(45deg) translate(-5px, -5px);
        }
      }
    }
  }
}
.dropdown {
  .dropdown-btn {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
}
</style>
