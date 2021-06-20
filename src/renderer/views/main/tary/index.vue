<template>
  <div class="tary">
    <div class="btn"><a-button type="primary" @click="pushNews()">推送消息</a-button></div>
    <section class="box">
      <a-list class="list" :data-source="list">
        <template #renderItem="{ item, index }">
          <a-list-item
            class="item"
            :class="{ active: item.id === activeId }"
            @click="openList(index)"
          >
            <a-badge :count="item.news">
              <a-list-item-meta
                :description="item.newsList[item.newsList.length - 1]"
              >
                <template #title>
                  <span>{{ item.name }}</span>
                </template>
                <template #avatar>
                  <a-avatar
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  />
                </template>
              </a-list-item-meta>
            </a-badge>
          </a-list-item>
        </template>
      </a-list>
      <div class="messageList">
        <ul class="messageBox" v-if="activeId">
          <li v-for="(item, index) in messageList" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, onUnmounted, computed } from 'vue'
import Mock from 'mockjs'

export default defineComponent({
  setup() {
    const state = reactive({
      activeId: '',
      list: [{
        name: Mock.mock('@cname'),
        id: Mock.mock('@id'),
        news: 0,
        newsList: []
      }, {
        name: Mock.mock('@cname'),
        id: Mock.mock('@id'),
        news: 0,
        newsList: []
      }, {
        name: Mock.mock('@cname'),
        id: Mock.mock('@id'),
        news: 0,
        newsList: []
      }]
    })
    onMounted(() => {
      window.ipcRenderer.on('renderer-message-read', (_, data) => {
        const index = data ? state.list.findIndex(s => s.id === data) : state.list.findIndex(s => s.news !== 0)
        ~index && openList(index)
      })
    })
    onUnmounted(() => {
      window.ipcRenderer.removeAllListeners('renderer-message-read')
    })
    const news = computed(() => state.list.reduce((pre, cur) => pre + cur.news, 0))
    const messageList = computed(() => state.list.find(s => s.id === state.activeId)['newsList'])
    function setMessage(obj) {
      window.ipcRenderer.invoke('win-message', obj)
    }
    function openList(index) {
      state.activeId = state.list[index].id
      state.list[index].news = 0
      setMessage({
        flashFrame: false,
        messageConfig: {
          news: news.value
        }
      })
    }
    setTimeout(() => {
      pushNews(0)
    }, 5000)
    function pushNews(index) {
      let flashFrame = true
      const hasFocus = document.hasFocus()
      const puahIndex = index != null ? index : getRandomIntInclusive(0, 2)
      const item = state.list[puahIndex]
      if (state.activeId !== item.id) {
        item.news += 1
        if (hasFocus) {
          flashFrame = false
        }
      } else {
        if (hasFocus) {
          flashFrame = false
        }
      }
      item.newsList.push(Mock.mock('@csentence(20)'))
      setMessage({
        flashFrame,
        messageConfig: {
          title: item.name,
          id: item.id,
          body: item.newsList[item.newsList.length - 1],
          news: news.value
        }
      })
    }
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    return {
      ...toRefs(state),
      messageList,
      openList,
      pushNews
    }
  }
})
</script>

<style lang="scss" scoped>
.tary {
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  .btn {
    flex: 0 0 40px;
  }
  .box {
    padding-top: 30px;
    display: flex;
    flex: 1;
    height: calc(100% - 40px);
    .list {
      width: 200px;
      flex: 0 0 200px;
      .item {
        cursor: pointer;
        &.active {
          background-color: #ddd;
        }
      }
    }
    .messageList {
      flex: 1;
      overflow-y: auto;
      height: 100%;
      .messageBox {
        list-style: none;
        > li {
          line-height: 30px;
          padding: 10px;
        }
      }
    }
  }
}
</style>
