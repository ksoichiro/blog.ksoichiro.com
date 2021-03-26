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
  margin-top: 0.4rem;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  .page-tag {
    background-color: $nord2;
    color: $nord4;
    transition: background-color .2s linear;
    padding: 0.4rem 0.6rem;
    margin-top: 0.2rem;
    margin-bottom: 0.4rem;
    border-radius: 0.8rem;
    &:not(:last-child) {
      margin-right: 0.6em;
    }
    &:hover {
      background-color: lighten($nord2, 10%);
      text-decoration: none;
    }
  }
}
</style>
