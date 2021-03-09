import { createRouter, createWebHashHistory } from 'vue-router'
import page from './page'
import routes from './modules'

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
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
  routes
})

page.forEach(s => {
  router.addRoute(s)
})

export default router
