<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1>{{$page.title}}</h1>
      <div class="last-updated">
        <span>{{$themeConfig.locales[$localePath].lastUpdated}}:</span>
        <span>{{$page.lastUpdated}}</span>
      </div>

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

export default {
  components: {
    // PageEdit,
    PageNav,
  },
  props: ['sidebarItems']
}
</script>
