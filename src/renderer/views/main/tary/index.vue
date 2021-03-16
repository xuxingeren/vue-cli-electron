<template>
  <div class="tary">
    tary
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance()
    proxy.$api('user.login', {}).then(res => {
      console.log(res)
    })
  }
})
</script>

<style lang="scss" scoped>

</style>
