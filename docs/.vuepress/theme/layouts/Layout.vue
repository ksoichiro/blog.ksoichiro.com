<template>
  <ParentLayout>
    <template #page-bottom>
      <Footer class="theme-default-content content__default" />
    </template>
  </ParentLayout>
</template>

<style>
.page-edit {
  display: none;
}
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
