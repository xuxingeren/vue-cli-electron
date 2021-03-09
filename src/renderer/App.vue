<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <router-view>
  </router-view>
  <closeModal />
</template>

<script>
import { defineComponent } from 'vue'
import closeModal from '@/components/closeModal'

export default defineComponent({
  components: {
    closeModal
  }
})
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
