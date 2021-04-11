<template>
  <div class="pagination">
    <div class="navigation">
      <NuxtLink v-if="!prevDisabled" :class="{'is-disabled': prevDisabled}" :to="localePath('/page/' + (page - 1))" class="hover:bg-nord1 hover:no-underline">
        &lt;
      </NuxtLink>
      <span v-else class="is-disabled">
        &lt;
      </span>
    </div>
    <div class="pages text-nord5">
      <span>{{ page }} / {{ maxPage }}</span>
    </div>
    <div class="navigation">
      <NuxtLink v-if="!nextDisabled" :class="{'is-disabled': nextDisabled}" :to="localePath('/page/' + (page + 1))" class="hover:bg-nord1 hover:no-underline">
        &gt;
      </NuxtLink>
      <span v-else class="is-disabled">
        &gt;
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true
    },
    maxPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    prevDisabled () {
      return this.page === 1
    },
    nextDisabled () {
      return this.page === this.maxPage
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  margin-top: 2rem;
  list-style: none;
  padding-left: 0;
  .navigation {
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .navigation, .pages {
    a, span {
      display: block;
      padding: .5rem .75rem;
      border-radius: 4px;
      font-size: .9em;
    }
  }
}
.is-disabled {
  pointer-events: none;
  opacity: .5;
}
</style>
