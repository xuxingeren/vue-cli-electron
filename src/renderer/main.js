import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import * as antIcons from '@ant-design/icons-vue'
import api from '@/api'
import '@/styles/index.scss'

const app = createApp(App)

Object.keys(antIcons).forEach(key => {
  app.component(key, antIcons[key])
})

app.config.globalProperties.$api = api
app.config.globalProperties.$antIcons = antIcons

app.use(Antd).use(store).use(router).mount('#app')
