<template>
  <div class="page-tags">
    <router-link
      v-for="tag in tags"
      :key="tag"
      class="page-tag"
      :to="{path: localePath('/tags#' + tag)}"
    >
      {{ tag }}
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tags {
  margin-top: 0.8rem;
  .page-tag {
    background-color: $nord2;
    color: $nord4;
    transition: background-color .2s linear;
    padding: 0.2rem 0.6rem;
    border-radius: 0.8rem;
    &:not(:first-child) {
      margin-left: 0.4em;
    }
    &:hover {
      background-color: lighten($nord2, 10%);
      text-decoration: none;
    }
  }
}
</style>
