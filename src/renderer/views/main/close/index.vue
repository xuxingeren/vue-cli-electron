<template>
  <div class="home">
    <a-button type="primary" @click="clear">清除关闭设置</a-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { LreItem } from '@/utils/storage'
import cfg from '@/config'

export default defineComponent({
  setup() {
    console.log(cfg)
    function clear() {
      LreItem('closeChecked')
    }
    return {
      clear
    }
  }
})
</script>

<style lang="scss" scoped>
</style>