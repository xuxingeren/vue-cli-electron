<template>
  <a-layout-sider
    class="sider"
    breakpoint="md"
    collapsed-width="80"
    @collapse="onCollapse"
    @breakpoint="onBreakpoint"
    v-model:collapsed="collapsed"
  >
    <!-- <div class="searchBox">
      <a-input-search
        v-if="!collapsed"
        placeholder="请输入"
        class="searchInput"
        :allowClear="true"
        @search="onSearch"
        @change="onChange"
        :autoFocus="true"
      />
      <SearchOutlined v-else class="searchIcon" @click="collapsed=false" />
    </div> -->
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      theme="dark"
      @click="open"
    >
      <template v-for="item in menus">
        <a-menu-item
          v-if="!(item.children && item.children.length > 0)"
          :key="item.path"
        >
          <component :is="$antIcons[item.meta.icon]" />
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.path" />
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { createNamespacedHelpers, useStore } from 'vuex'
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import SubMenu from './SubMenu'
const { mapGetters } = createNamespacedHelpers('role')

export default defineComponent({
  name: 'sider',
  components: {
    'sub-menu': SubMenu,
    SearchOutlined
  },
  computed: {
    ...mapGetters({
      menus: 'menus',
      collapsed: 'collapsed'
    })
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      openKeys: store.state.role.menus.map(({ path }) => path),
      preOpenKeys: [route.path],
      selectedKeys: [route.path]
    })
    watch(() => state.openKeys, (_, oldVal) => {
      state.preOpenKeys = oldVal
    })
    watch(() => store.state.role.collapsed, (val) => {
      state.openKeys = val ? [] : state.preOpenKeys
    })
    watch(() => route.path, (val) => {
      if (val !== state.selectedKeys[0]) {
        state.selectedKeys = [val]
      }
    })
    function open({ key }) {
      router.push({
        path: key
      })
    }
    function onSearch(val) {
      store.commit('role/FIND_MENU', val.trim())
    }
    function onChange(e) {
      if (!e.currentTarget.value.trim()) store.commit('role/FIND_MENU', '')
    }
    function onCollapse(collapsed, type) {
      console.log(collapsed, type)
    }
    function onBreakpoint(broken) {
      console.log(broken)
    }
    return {
      ...toRefs(state),
      open,
      onSearch,
      onChange,
      onCollapse,
      onBreakpoint
    }
  }
})
</script>

<style lang="scss" scoped>
.sider {
  height: 100vh;
  position: fixed;
  left: 0;
  .searchBox {
    height: 32px;
    background: #fff;
    margin: 16px;
    border-radius: 4px;
    .searchIcon {
      vertical-align: top;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }
  }
}
</style>