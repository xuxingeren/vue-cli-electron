<template>
  <a-layout-content class="content-view">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <!-- <keep-alive> -->
          <component :is="Component" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </a-layout-content>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { defineComponent } from 'vue'
const { mapGetters } = createNamespacedHelpers('role')

export default defineComponent({
  name: 'ContentView',
  computed: {
    ...mapGetters(['breadcrumb'])
  },
  methods: {}
})
</script>

<style lang="scss" scoped>
.content-view {
  display: flex;
  border-radius: 4px;
  flex: 1;
  margin: 24px;
  background-color: #fff;
  overflow-y: auto;
}
</style>