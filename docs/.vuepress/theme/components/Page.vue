<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1>{{$page.title}}</h1>
      <PageAttributes :page="$page" />

      <Content />
    </div>

    <!-- I don't need PageEdit feature -->
    <!-- <PageEdit /> -->

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
// import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'
import PageAttributes from '../../components/PageAttributes.vue'

export default {
  components: {
    // PageEdit,
    PageNav,
    PageAttributes,
  },
  props: ['sidebarItems']
}
</script>
