import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import routes from './modules'
import page from './page'
import store from '../store'

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL),
  fallback: false,
  scrollBehavior(to, from, savedPosition) {
    // keep-alive 返回缓存页面后记录浏览位置
    if (savedPosition && to.meta.keepAlive) {
      return savedPosition
    }
    // 异步滚动操作
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ left: 0, top: 1 })
      }, 0)
    });
  },
  routes: [{
    path: '/',
    redirect: '/main'
  },
  ...page,
  ...routes]
})

store.commit('role/SET_MENU_ALL', routes)

export default router
