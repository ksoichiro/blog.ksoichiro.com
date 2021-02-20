<template>
  <div id="nav" :class="{'is-open': isMenuOpen }">
    <div class="nav-item">
      <NuxtLink :to="localePath">
        memorandum
      </NuxtLink>
    </div>
    <div class="nav-item">
      <div>
        <NuxtLink :to="localePath + 'tags'">
          Tags
        </NuxtLink>
      </div>
    </div>
    <div class="nav-item dropdown">
      <div class="dropdown-btn">
        Language
        <span class="caret" />
      </div>
      <div class="dropdown-content">
        <div>
          <NuxtLink :to="toEn(path)">
            en
          </NuxtLink>
        </div>
        <div>
          <NuxtLink :to="toJa(path)">
            ja
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="menu" @click="toggleMenu">
      <div class="bar1" />
      <div class="bar2" />
      <div class="bar3" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      required: true
    },
    localePath: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleMenu () {
      this.isMenuOpen = !this.isMenuOpen
    },
    toEn (path) {
      return this.isJa(path) ? path.replace('/ja', '') : path
    },
    toJa (path) {
      return this.isJa(path) ? path : '/ja' + path
    },
    isJa (path) {
      return path && path.match(/^\/ja/)
    }
  }
}
</script>

<style lang="scss" scoped>
#nav {
  display: flex;
  background-color: #333;
  color: #fff;
  align-items: center;

  a {
    color: #fff;
  }
  .nav-item {
    display: block;
    padding: 1rem;
    &.dropdown {
      padding: 0;
    }
    &:first-child {
      margin-right: auto;
    }
  }
  .menu {
    display: none;
  }
}
@media screen and (max-width: 600px) {
  #nav {
    flex-direction: column;
    position: relative;
    .nav-item:not(:first-child) {
      display: none;
    }
    .menu {
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      padding: 1rem;
      cursor: pointer;
      div {
        width: 18px;
        height: 2px;
        background-color: #fff;
        margin: 4px 0;
        transition: .4s;
      }
    }

    &.is-open {
      .nav-item:not(:first-child) {
        display: block;
        width: 100%;
        background-color: #333;
      }
      .menu {
        .bar1 {
          -webkit-transform: rotate(-45deg) translate(-4px, 3px);
          transform: rotate(-45deg) translate(-4px, 3px);
        }
        .bar2 {
          opacity: 0;
        }
        .bar3 {
          -webkit-transform: rotate(45deg) translate(-5px, -5px);
          transform: rotate(45deg) translate(-5px, -5px);
        }
      }
    }
  }
}
.dropdown {
  .dropdown-btn {
    padding: 1rem;
    cursor: pointer;
    margin-right: 10px;
  }
  .dropdown-content {
    position: absolute;
    display: none;
    background-color: #333;
    & > * {
      padding: 0.25rem;
      padding-left: 1.25rem;
      width: 100%;
      min-width: 160px;
    }
  }
  &:hover {
    .dropdown-content {
      display: block;
      & > * {
        display: block;
      }
    }
  }
}
@media screen and (max-width: 600px) {
  .dropdown {
    .dropdown-content {
      position: relative;
    }
  }
}
.caret {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 40%;
    left: 4px;
    border-top: 6px solid #fff;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }
}
</style>
