<template>
  <div class="subScreen">{{ state.message }}</div>
</template>

<script>
import { defineComponent, reactive, onMounted, onUnmounted } from 'vue'
const { remote } = require('electron')

export default defineComponent({
  setup() {
    const state = reactive({
      message: ''
    })
    onMounted(() => {
      const win = remote.getGlobal('sharedObject').win
      window.ipcRenderer.on('renderer-subScreen-message', (_event, data) => {
        state.message = data
        window.ipcRenderer.sendTo(win.webContents.id, 'subScree-main', '我收到了中转发送信息')
      })
      window.ipcRenderer.on('main-subScree', (_event, data) => {
        state.message = data
        window.ipcRenderer.sendTo(win.webContents.id, 'subScree-main', '我收到了直接发送信息')
      })
    })
    onUnmounted(() => {
      window.ipcRenderer.removeAllListeners('renderer-subScreen-message')
      window.ipcRenderer.removeAllListeners('main-subScree')
    })
    return {
      state
    }
  }
})
</script>

<style lang="scss" scoped>
</style>