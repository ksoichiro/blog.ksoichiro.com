<template>
  <span class="page-tags">
    <PriceTagsIcon />
    <router-link
      v-for="tag in tags"
      class="page-tag"
      :key="tag"
      :to="{path: `${$localePath}tags/#${tag}`}">{{tag}}</router-link>
  </span>
</template>

<style lang="scss" scoped>
.page-tags {
  display: inline-block;
}

.page-tags > .page-tag:not(:last-of-type)::after {
  content: ', ';
}
</style>

<script>
import PriceTagsIcon from 'vue-ionicons/dist/md-pricetags.vue'

export default {
  props: ['tags', 'localePath'],
  components: {
    PriceTagsIcon
  }
}
</script>
