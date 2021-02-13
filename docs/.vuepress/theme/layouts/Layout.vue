<template>
  <ParentLayout>
    <template #page-bottom>
      <Footer/>
    </template>
  </ParentLayout>
</template>

<style lang="stylus" scoped>
.footer
  padding 2.5rem
  border-top 1px solid $borderColor
</style>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import Footer from '../../components/Footer.vue'

export default {
  name: 'Layout',
  components: {
    ParentLayout,
    Footer,
  }
}
</script>
