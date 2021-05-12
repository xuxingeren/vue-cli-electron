import axios from 'axios'
import cfg from '@/config'
import { addPending, removePending, clearPending } from './padding'
import { LreItem, LgetItem } from '@/utils/storage'
import statusCode from './statusCode'
import { USER_TOKEN } from '@/config/const'
import { message } from 'ant-design-vue'

axios.defaults.baseURL = `${cfg.host}${cfg.baseUrl}`
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.get['Accept'] = 'application/json'
axios.defaults.timeout = 20000
axios.defaults.withCredentials = true

axios.interceptors.request.use(
  config => {
    if (config.headers['noHeader']) {
      delete config.headers
    } else {
      LgetItem(USER_TOKEN) && (config.headers[USER_TOKEN] = LgetItem(USER_TOKEN))
    }
    removePending(config, false)
    addPending(config)
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(res => {
  // 响应拦截
  removePending(res.config, true)
  // 响应拦截
  if (res.data && res.data.success) {
    return res.data.data
  } else {
    if (res.config.requestMessage && statusCode[res.data.code]) {
      message.error(statusCode[res.data.code])
    }
    if (res.data.code === 401) {
      clearPending()
      console.log('token失效')
      LreItem(USER_TOKEN)
      if (cfg.isLogining) {
        cfg.isLogining = false
        window.location.reload()
      }
    }
    return Promise.reject(res.data)
  }
}, err => {
  err.config && removePending(err.config, true)
  let msg = '请求出错，请稍后重试！'
  if (err.message.includes('timeout')) {
    msg = '请求超时'
  } else if (err.response) {
    msg = err.response.data.message
    switch (err.response.status) {
      case 404:
        msg = 'Not Found'
        break
      case 400:
        msg = err.response.data.error
        break
    }
  } else if (err.__CANCEL__) {
    msg = '请求取消'
  }
  !err.__CANCEL__ && message.error(msg)
  return Promise.reject(err && err.response ? err.response.data : { message: msg, cancel: !!err.__CANCEL__ })
})

export default function (options) {
  const params = {
    method: options.method,
    url: options.url,
    data: options.params,
    requestMessage: true,
    requestSame: 'throttle',
    ...options.other
  }
  if (params.method.toLowerCase() === 'get') {
    params.params = params.data
    delete params.data
  }
  return axios(params)
}