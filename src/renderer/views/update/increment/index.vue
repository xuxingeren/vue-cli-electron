<template>
  <div class="increment">
    <div class="version">当前版本为：{{ config.VUE_APP_VERSION }}</div>
    <a-button type="primary" @click="upDateClick(true)">检测更新</a-button>
  </div>
</template>

<script>
import cfg from '@/config'
import update from '@/utils/update'
import { defineComponent, getCurrentInstance } from 'vue'

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance()
    const config = cfg
    const api = proxy.$api
    const message = proxy.$message
    function upDateClick(isClick) {
      api('http://localhost:4000/index.json', {}, { method: 'get' }).then(res => {
        console.log(res)
        if (cfg.NODE_ENV !== 'development') {
          update(config.VUE_APP_VERSION, res).then(() => {
            if (!res.fullUpdate) {
              window.ipcRenderer.invoke('win-increment', res)
            }
          }).catch(err => {
            if (err.code === 0) {
              isClick && message.success('已为最新版本')
            }
          })
        } else {
          message.success('请在打包环境下更新')
        }
      })
    }
    return {
      config,
      upDateClick
    }
  }
})
</script>


<style lang="scss" scoped>
.update {
  padding: 10px;
}
</style>