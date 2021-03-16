import axios from 'axios'
import qs from 'qs'
const pending = new Map()
/**
 * 添加请求
 * @param {Object} config
 */
export const addPending = (config) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&')
  config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
    if (!pending.has(url)) { // 如果 pending 中不存在当前请求，则添加进去
      if (['throttle', 'debounce'].includes(config.requestSame)) {
        pending.set(url, cancel)
      }
    } else {
      if (config.requestSame === 'debounce') {
        cancel('debounce')
      }
    }
  })
}
/**
 * 移除请求
 * @param {Object} config
 */
export const removePending = (config, force) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    typeof config.data === 'string' ? qs.stringify(JSON.parse(config.data)) : qs.stringify(config.data)
  ].join('&')
  if (pending.has(url)) { // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
    if (config.requestSame === 'throttle') {
      const cancel = pending.get(url)
      cancel(url)
      pending.delete(url)
    }
    if (config.requestSame === 'debounce' && force) {
      pending.delete(url)
    }
  }
}
/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
  // eslint-disable-next-line no-unused-vars
  for (const [url, cancel] of pending) {
    cancel(url)
  }
  pending.clear()
}
