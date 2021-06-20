<template>
  <div class="update">
    <div class="version">当前版本为：{{ config.VUE_APP_VERSION }}</div>
    <a-button type="primary" @click="upDateClick(true)">检测更新</a-button>
    <a-modal
      v-model:visible="visible"
      title="更新"
      @ok="upDateOk"
      @cancel="upDateCancel"
      :closable="!upDateData.forceUpdate"
      :maskClosable="false"
      :keyboard="!upDateData.forceUpdate"
      :destroyOnClose="true"
    >
      <p v-html="upDateData.message"></p>
      <template #footer v-if="upDateData.forceUpdate">
        <div class="footer">
          <a-button type="primary" @click="upDateOk">确定</a-button>
        </div>
      </template>
    </a-modal>
    <a-modal
      v-model:visible="upDateProgress.show"
      title="下载中"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      :footer="null"
    >
      <a-progress :percent="upDateProgress.percent" status="active" />
    </a-modal>
  </div>
</template>

<script>
import cfg from '@/config'
import { UPDATE_LIST } from '@/config/const'
import update from '@/utils/update'
import { LgetItem, LsetItem } from '@/utils/storage'
import { defineComponent, getCurrentInstance, reactive, toRefs, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  setup() {
    const state = reactive({
      visible: false,
      upDateData: {},
      upDateProgress: {
        show: false,
        percent: 0
      }
    })
    const { proxy } = getCurrentInstance()
    const config = cfg
    const api = proxy.$api
    const message = proxy.$message
    onMounted(() => {
      window.ipcRenderer.on('renderer-updateMsg', (_, data) => {
        switch (data.type) {
          case -1:
            message.error(data.data)
            break
          case 0:
            message.info('正在检查更新')
            break
          case 1:
            message.destroy()
            message.success('已检查到新版本，开始下载')
            state.upDateProgress.show = true
            break
          case 2:
            message.destroy()
            message.success('无新版本')
            break
          case 3:
            state.upDateProgress.percent = data.data.percent.toFixed(1)
            break
          case 4:
            state.upDateProgress.show = false
            message.loading('重启更新中...', 1)
            break
          case 5:
            message.destroy()
            message.warning(data.data)
            state.upDateProgress.show = false
            break
          default:
            break
        }
      })
    })
    onUnmounted(() => {
      window.ipcRenderer.removeAllListeners('renderer-updateMsg')
    })
    function upDateClick(isClick) {
      api('http://localhost:4000/index.json', {}, { method: 'get' }).then(res => {
        console.log(res)
        if (cfg.NODE_ENV !== 'development') {
          update(config.VUE_APP_VERSION, res).then(() => {
            state.upDateData = res
            if (res.fullUpdate) {
              updateNotice(isClick)
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
    function updateNotice(isClick) {
      if (LgetItem(UPDATE_LIST) && LgetItem(UPDATE_LIST)[state.upDateData.version] && !isClick) {
        return
      }
      state.visible = true
    }
    function upDateOk() {
      state.visible = false
      window.ipcRenderer.invoke('win-update', {...state.upDateData})
    }
    function upDateCancel() {
      if (!LgetItem(UPDATE_LIST)) {
        LsetItem(UPDATE_LIST, {})
      }
      LsetItem(UPDATE_LIST, { ...LgetItem(UPDATE_LIST), [state.upDateData.version]: true })
    }
    return {
      config,
      ...toRefs(state),
      upDateClick,
      upDateOk,
      upDateCancel
    }
  }
})
</script>


<style lang="scss" scoped>
.update {
  padding: 10px;
}
</style>