<template>
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
import { LgetItem, LsetItem } from '@/utils/storage'

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
      window.ipcRenderer.on('renderer-close-tips', (event, data) => {
        const closeChecked = LgetItem('closeChecked')
        const isMac = data.isMac
        if (closeChecked || isMac) {
          event.sender.invoke('win-close', LgetItem('closeValue'))
        } else {
          visible.value = true
          event.sender.invoke('win-focus', closeValue.value)
        }
      })
    })
    onUnmounted(() => {
      window.ipcRenderer.removeAllListeners('renderer-close-tips')
    })
    async function hideModal() {
      if (closeChecked.value) {
        LsetItem('closeChecked', true)
        LsetItem('closeValue', closeValue.value)
      }
      await window.ipcRenderer.invoke('win-close', closeValue.value)
      visible.value = false
    }

    return {
      closeChecked,
      closeValue,
      radioStyle,
      visible,
      hideModal
    }
  }
})
</script>