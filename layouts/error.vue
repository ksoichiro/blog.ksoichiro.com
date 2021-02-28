<template>
  <div>
    <nav-bar :path="localePath('/tags')" />
    <div class="content">
      <h1 v-if="error.statusCode === 404">
        {{ $t('pageNotFound') }}
      </h1>
      <h1 v-else>
        {{ $t('errorOccurred') }}
      </h1>
      <div>
        <nuxt-link :to="localePath('/')">
          {{ $t('backToHome') }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {
      type: Object,
      required: true
    }
  }
}
</script>
