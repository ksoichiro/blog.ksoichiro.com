<template>
  <div class="text-nord5 text-sm">
    <div>
      <TimeOutlineIcon />
      <span :title="$t('created') + ': ' + longDate(page.createdAt)" class="inline-block align-middle">{{ shortDate(page.createdAt) }}</span>
      <CreateOutlineIcon v-if="page.createdAt !== page.updatedAt" />
      <span v-if="page.createdAt !== page.updatedAt" :title="$t('updated') + ': ' + longDate(page.updatedAt)" class="inline-block align-middle">{{ shortDate(page.updatedAt) }}</span>
    </div>
    <PageTags :tags="page.tags" />
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
  components: {
    TimeOutlineIcon,
    CreateOutlineIcon,
    PageTags
  },
  props: {
    page: {
      type: Object,
      required: true
    }
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
