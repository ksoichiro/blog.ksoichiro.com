<template>
  <div class="text-nord5 text-center border-t border-nord1 p-10">
    <p class="text-sm mb-2.5">
      &copy; 2010 ksoichiro
    </p>
    <div>
      <a class="text-nord5 text-2xl hover:text-nord9 text-center" href="https://github.com/ksoichiro" aria-label="GitHub Profile" target="_blank" rel="noopener">
        <LogoGitHubIcon class="inline" />
      </a>
    </div>
  </div>
</template>

<script>
import LogoGitHubIcon from 'vue-ionicons/dist/logo-github.vue'

export default {
  components: {
    LogoGitHubIcon
  }
}
</script>
