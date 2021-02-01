<template>
  <span class="page-tags">
    <PriceTagsIcon />
    <router-link
      v-for="tag in frontmatter.tags"
      :key="tag"
      :to="{path: `${$localePath}tags/#${tag}`}">
      {{tag}}
    </router-link>
  </span>
</template>

<style lang="stylus" scoped>
.page-tags
  display: inline-block
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
