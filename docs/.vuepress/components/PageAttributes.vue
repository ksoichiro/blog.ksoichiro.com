<template>
  <div class="page-attributes" v-if="!page.frontmatter.noPageAttributes && page.lastUpdated">
    <TimeOutlineIcon />
    <span :title="$themeConfig.locales[$localePath].created + ': ' + longDate(page.created)">{{shortDate(page.created)}}</span>
    <CreateOutlineIcon />
    <span :title="$themeConfig.locales[$localePath].lastUpdated + ': ' + longDate(page.lastUpdated)">{{shortDate(page.lastUpdated)}}</span>
    <PageTags :frontmatter="page.frontmatter" />
  </div>
</template>

<script>
import TimeOutlineIcon from 'vue-ionicons/dist/md-time.vue'
import CreateOutlineIcon from 'vue-ionicons/dist/md-create.vue'
import PageTags from './PageTags.vue'
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

export default {
  props: ['page'],
  components: {
    TimeOutlineIcon,
    CreateOutlineIcon,
    PageTags,
  },
  methods: {
    shortDate (timestamp) {
      return this.formatTimestamp(timestamp, 'YYYY/MM/DD')
    },
    longDate (timestamp) {
      return this.formatTimestamp(timestamp, 'YYYY/MM/DD HH:mmZ')
    },
    formatTimestamp (timestamp, format) {
      return dayjs(timestamp).tz('Asia/Tokyo').format(format)
    }
  }
}
</script>
