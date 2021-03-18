<template>
  <a-layout class="layout">
    <Sider />
    <Content />
  </a-layout>
</template>

<script>
import { defineComponent } from 'vue'
import Sider from './Sider/index'
import Content from './Content/index'

export default defineComponent({
  components: {
    Sider,
    Content
  }
})
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-height: 100vh;
  flex: 1;
}
</style>