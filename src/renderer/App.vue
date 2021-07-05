<template>
  <a-config-provider :locale="zh_CN">
    <a-config-provider>
      <router-view />
    </a-config-provider>
  </a-config-provider>
  <closeModal />
</template>

<script>
import cfg from '@/config'
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN"
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import closeModal from '@/components/closeModal'

export default defineComponent({
  components: {
    closeModal
  },
  setup() {
    const router = useRouter()
    console.log(cfg)
    window.ipcRenderer.invoke('win-envConfig', cfg)
    onMounted(() => {
      window.ipcRenderer.on('renderer-scheme', (_event, data) => {
        console.log(data)
        const urlObj = new URL(data)
        const query = {}
        urlObj.search.slice(1).split('&').forEach(s => {
          const item = s.split('=')
          query[item[0]] = item[1]
        })
        router.replace({
          path: urlObj.pathname.slice(2),
          query
        })
      })
    })
    onUnmounted(() => {
      window.ipcRenderer.removeAllListeners('renderer-scheme')
    })
    return {
      zh_CN
    }
  }
})
</script>

<style lang="scss">
#app {
  height: 100%;
  display: flex;
}
</style>
