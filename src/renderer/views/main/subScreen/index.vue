<template>
  <div class="subScreen">
    <a-button type="primary" @click="openScreen">打开拓展屏</a-button>
    <div class="subMessage">
      <a-textarea
        v-model:value="state.message"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
      <a-button type="primary" :disabled="state.message.length === 0" @click="transferSub">中转发送</a-button>
      <a-button type="primary" :disabled="state.message.length === 0" @click="directSub">直接发送</a-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted, onUnmounted, getCurrentInstance } from 'vue'
const { remote } = require('electron')

export default defineComponent({
  setup() {
    const state = reactive({
      open: true,
      message: ''
    })
    const { proxy } = getCurrentInstance()
    const { $message } = proxy
    async function openScreen() {
      await window.ipcRenderer.invoke('win-subScreen', {
        open: state.open,
        path: '#/subScreen'
      })
      state.open = !state.open
    }
    function transferSub() {
      window.ipcRenderer.invoke('win-subScreen-message', state.message)
    }
    function directSub() {
      const subScreen = remote.getGlobal('sharedObject').subScreen
      if (subScreen) {
        window.ipcRenderer.sendTo(subScreen.webContents.id, 'main-subScree', state.message)
      }
    }
    onMounted(() => {
      window.ipcRenderer.on('subScree-main', (_event, data) => {
        $message.success(data)
      })
    })
    onUnmounted(() => {
      window.ipcRenderer.removeAllListeners('subScree-main')
    })
    return {
      openScreen,
      transferSub,
      directSub,
      state
    }
  }
})
</script>

<style lang="scss" scoped>
.subScreen {
  .subMessage {
    margin: 20px;
    button {
      margin-top: 20px;
      margin-right: 20px;
    }
  }
}
</style>