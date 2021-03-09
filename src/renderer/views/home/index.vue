<template>
  <div class="home">
    <a-button type="primary" @click="clear">清除关闭设置</a-button>
  </div>
</template>

<script>
import {
  useStore,
  // mapState,
  // mapMutations,
  // mapActions,
  // mapGetters
} from 'vuex'
import { defineComponent } from 'vue'
import { LreItem } from '@/utils/storage'
export default defineComponent({
  setup() {
    const store = useStore()
    console.log(store.state.home)
    function clear() {
      LreItem('closeChecked')
    }
    return {
      clear
    }
  }
})
</script>

<style lang="scss" scoped>

</style>