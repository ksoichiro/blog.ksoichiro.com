<template>
  <span>
    <!--
      svg is copied from 'vue-ionicons/dist/md-arrow-dropdown.vue'.
      It is extracted because div tag (display: block) inside md-open causes error for inline usage.
    -->
    <svg :class="classes" viewBox="72 72 384 384" width="1rem" height="1rem" class="ion__svg inline fill-current"><path d="M128 192l128 128 128-128z"/></svg>
  </span>
</template>

<script>
export default {
  props: {
    classes: {
      type: String,
      required: false,
      default: 'text-nord3'
    }
  }
}
</script>
