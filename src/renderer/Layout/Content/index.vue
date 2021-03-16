<template>
  <a-layout
    class="content"
    :ref="refs"
    :style="{ marginLeft: collapsed ? '80px':'200px' }"
  >
    <content-header />
    <content-view />
    <a-back-top :target="backTop" />
  </a-layout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { defineComponent } from 'vue'
import ContentHeader from './ContentHeader'
import ContentView from './ContentView'
const { mapGetters } = createNamespacedHelpers('role')

export default defineComponent({
  name: 'Content',
  components: {
    'content-header': ContentHeader,
    'content-view': ContentView
  },
  computed: {
    ...mapGetters(['collapsed'])
  },
  setup() {
    let content = ''
    const refs = el => {
      content = el
    }
    function backTop() {
      return content.$el
    }
    return {
      backTop,
      refs
    }
  }
})
</script>

<style lang="scss" scoped>
.content {
  transition: all 0.2s;
  overflow-x: visible !important;
}
</style>