<template>
  <span class="page-tags">
    <PriceTagsIcon />
    <router-link
      v-for="tag in frontmatter.tags"
      class="page-tag"
      :key="tag"
      :to="{path: `${$localePath}tags/#${tag}`}">{{tag}}</router-link>
  </span>
</template>

<style lang="stylus" scoped>
.page-tags
  display inline-block

.page-tags > .page-tag:not(:last-of-type)::after
  content: ', '
</style>

<script>
import PriceTagsIcon from 'vue-ionicons/dist/md-pricetags.vue'

export default {
  props: ['frontmatter'],
  components: {
    PriceTagsIcon
  }
}
</script>
