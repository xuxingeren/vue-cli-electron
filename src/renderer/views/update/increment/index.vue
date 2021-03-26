<template>
  <div class="increment">
    <div class="version">当前版本为：{{ config.VUE_APP_VERSION }}</div>
  </div>
</template>

<script>
import cfg from '@/config'
import { defineComponent, getCurrentInstance, reactive, toRefs, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  setup() {
    const config = cfg
    return {
      config
    }
  }
})
</script>


<style lang="scss" scoped>
.update {
  padding: 10px;
}
</style>