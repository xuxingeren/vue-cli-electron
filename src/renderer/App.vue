<template>
  <a-config-provider :locale="zh_CN">
    <a-config-provider>
      <router-view />
    </a-config-provider>
  </a-config-provider>
  <closeModal />
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN"
import { defineComponent } from 'vue'
import closeModal from '@/components/closeModal'

export default defineComponent({
  components: {
    closeModal
  },
  setup() {
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
