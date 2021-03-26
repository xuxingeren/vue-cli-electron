<template>
  <a-layout-header class="layout-header">
    <div class="content-header">
      <div class="header-left">
        <a-button @click="toggleCollapsed">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </a-button>
      </div>
      <div class="logo">
        <img src="@/assets/logo.png" alt="">
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import { createNamespacedHelpers, useStore } from 'vuex'
import { defineComponent } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
const { mapGetters } = createNamespacedHelpers('role')

export default defineComponent({
  name: 'ContentHeader',
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined
  },
  computed: {
    ...mapGetters(['collapsed'])
  },
  setup() {
    const store = useStore()
    function toggleCollapsed() {
      store.commit('role/SET_COLLAPSED', !store.state.role.collapsed)
    }
    return {
      toggleCollapsed
    }
  }
})
</script>

<style lang="scss" scoped>
.layout-header {
  padding: 0;
  z-index: 9;
  position: sticky;
  top: 0;
  right: 0;
  .content-header {
    background-color: #fff;
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 24px;
    justify-content: space-between;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    .header-right,
    .header-left {
      display: flex;
      align-items: center;
    }
    .logo {
      height: 100%;
      font-size: 0;
      > img {
        height: 100%;
      }
    }
    .ant-dropdown-link {
      padding: 0 12px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
      .avatar-name {
        margin-left: 8px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}
</style>