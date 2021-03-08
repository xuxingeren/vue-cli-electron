<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <a-button type="primary" @click="clear">清除关闭设置</a-button>
  <a-modal
    v-model:visible="visible"
    :destroyOnClose="true"
    title="关闭提示"
    ok-text="确认"
    cancel-text="取消"
    @ok="hideModal"
  >
    <a-radio-group v-model:value="closeValue">
      <a-radio :style="radioStyle" :value="1">最小化到托盘</a-radio>
      <a-radio :style="radioStyle" :value="2">退出vue-cli-electron</a-radio>
      <a-checkbox v-model:checked="closeChecked">不再提醒</a-checkbox>
    </a-radio-group>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onUnmounted } from 'vue'
import { LgetItem, LsetItem, LreItem } from '@/utils/storage'
import cfg from '@/config'

export default defineComponent({
  setup() {
    const closeChecked = ref(false)
    const closeValue = ref(1)
    const visible = ref(false)
    const radioStyle = reactive({
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    })
    onMounted(() => {
      console.log(cfg)
      window.ipcRenderer.on('win-close-tips', (event) => {
        const closeChecked = LgetItem('closeChecked')
        if (closeChecked) {
          event.sender.invoke('win-close', LgetItem('closeValue'))
        } else {
          visible.value = true
          event.sender.invoke('win-focus', closeValue.value)
        }
      })
    })
    onUnmounted(() => {
      window.ipcRenderer.removeListener('win-close-tips')
    })
    async function hideModal() {
      if (closeChecked.value) {
        LsetItem('closeChecked', true)
        LsetItem('closeValue', closeValue.value)
      }
      await window.ipcRenderer.invoke('win-close', closeValue.value)
      visible.value = false
    }

    function clear() {
      LreItem('closeChecked')
    }

    return {
      closeChecked,
      closeValue,
      radioStyle,
      visible,
      hideModal,
      clear
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
