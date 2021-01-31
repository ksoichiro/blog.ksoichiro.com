<template>
  <ParentLayout>
    <template #page-bottom>
      <Footer class="theme-default-content content__default" />
    </template>
  </ParentLayout>
</template>

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
