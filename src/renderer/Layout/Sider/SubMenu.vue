<template>
  <a-sub-menu :key="menuInfo.path" v-bind="$attrs">
    <template #title>
      <component :is="$antIcons[menuInfo.meta.icon]" />
      <span>{{ menuInfo.meta.title }}</span>
    </template>
    <template v-for="item in menuInfo.children">
      <a-menu-item
        v-if="!(item.children && item.children.length > 0)"
        :key="item.path"
      >
        <component :is="$antIcons[item.meta.icon]" />
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
      <sub-menu
        v-else
        :key="item.path"
        :menu-info="item"
      />
    </template>
  </a-sub-menu>
</template>
<script>

export default {
  name: 'SubMenu',
  props: {
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>