<template>
  <div class="pagination">
    <div>
      <a :class="{'is-disabled': prevDisabled}" @click="setPage(page - 1)">
        &lt;
      </a>
    </div>
    <div>
      <a :class="{'is-disabled': nextDisabled}" @click="setPage(page + 1)">
        &gt;
      </a>
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
  },
  methods: {
    setPage (page) {
      this.$emit('setPage', page)
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
  & > * {
    cursor: pointer;
    a {
      display: block;
      padding: .5rem .75rem;
      border-radius: 4px;
      &:hover {
        background-color: $secondaryBackgroundColor;
      }
    }
  }
}
.is-disabled {
  pointer-events: none;
  opacity: .5;
}
</style>
