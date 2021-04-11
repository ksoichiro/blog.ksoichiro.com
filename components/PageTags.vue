<template>
  <div class="page-tags mt-2 flex flex-row flex-wrap items-start">
    <router-link
      v-for="tag in tags"
      :key="tag"
      class="page-tag bg-nord2 text-nord4 py-2 px-3 mt-1 mb-2 mr-2 last:mr-0 rounded-xl transition-colors hover:no-underline hover:bg-nord2-light"
      :to="{path: localePath('/tags#' + tag)}"
    >
      {{ tag }}
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true
    }
  }
}
</script>
