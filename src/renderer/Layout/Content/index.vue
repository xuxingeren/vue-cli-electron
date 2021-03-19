<template>
  <a-layout
    class="content"
    ref="content"
    :style="{ marginLeft: collapsed ? '80px':'200px' }"
  >
    <content-header />
    <content-view />
    <a-back-top :target="backTop" />
  </a-layout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { defineComponent, ref } from 'vue'
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
    const content = ref(null)
    function backTop() {
      return content.value.$el.children[1]
    }
    return {
      backTop,
      content
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