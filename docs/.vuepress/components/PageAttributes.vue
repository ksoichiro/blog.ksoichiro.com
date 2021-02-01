<template>
  <div class="page-attributes" v-if="!page.frontmatter.noPageAttributes && page.lastUpdated">
    <TimeOutlineIcon />
    <span>{{$themeConfig.locales[$localePath].lastUpdated}}:</span>
    <span>{{page.lastUpdated}}</span>
    <PageTags :frontmatter="page.frontmatter" />
  </div>
</template>

<script>
import TimeOutlineIcon from 'vue-ionicons/dist/md-time.vue'
import PageTags from './PageTags.vue'

export default {
  props: ['page'],
  components: {
    TimeOutlineIcon,
    PageTags,
  },
}
</script>
