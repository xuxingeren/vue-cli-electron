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
    function setMessage(flag) {
      window.ipcRenderer.invoke('win-message', flag)
    }
    setTimeout(() => {
      const hasFocus = document.hasFocus()
      setMessage({
        flashFrame: !hasFocus,
        flashTray: true
      })
    }, 3000)
    return {
      clear,
      setMessage
    }
  }
})
</script>

<style lang="scss" scoped>
.home {
  height: 3000px;
}
</style>