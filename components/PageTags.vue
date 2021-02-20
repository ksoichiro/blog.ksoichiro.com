<template>
  <span class="page-tags">
    <PriceTagsIcon />
    <router-link
      v-for="tag in tags"
      :key="tag"
      class="page-tag"
      :to="{path: `${localePath}tags/#${tag}`}"
    >
      {{ tag }}
    </router-link>
  </span>
</template>

<script>
import PriceTagsIcon from 'vue-ionicons/dist/md-pricetags.vue'

export default {
  components: {
    PriceTagsIcon
  },
  props: {
    tags: {
      type: Array,
      required: true
    },
    localePath: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tags {
  display: inline-block;
}

.page-tags > .page-tag:not(:last-of-type)::after {
  content: ', ';
}
</style>
