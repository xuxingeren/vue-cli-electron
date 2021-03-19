import { autoUpdater } from 'electron-updater'
import log from '../config/log.js'
import global from '../config/global'
autoUpdater.logger = log
/**
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 **/
function Message(type, data) {
  const sendData = {
    type,
    data
  }
  global.sharedObject.win.webContents.send('renderer-updateMsg', sendData)
}

// 当更新发生错误的时候触发。
autoUpdater.on('error', (err) => {
  log.info('更新出现错误')
  log.info(err.message)
  if (err.message.includes('sha512 checksum mismatch')) {
    Message(-1, 'sha512校验失败')
  }
})

// 当开始检查更新的时候触发
autoUpdater.on('checking-for-update', () => {
  log.info('开始检查更新')
  Message(0)
})

// 发现可更新数据时
autoUpdater.on('update-available', () => {
  log.info('有更新')
  Message(1)
})

// 没有可更新数据时
autoUpdater.on('update-not-available', () => {
  log.info('没有更新')
  Message(2)
})

// 下载监听
autoUpdater.on('download-progress', (progressObj) => {
  Message(3, progressObj)
})

// 下载完成
autoUpdater.on('update-downloaded', () => {
  log.info('下载完成')
  Message(4)
  setTimeout(() => {
    global.willQuitApp = true
    autoUpdater.quitAndInstall()
  }, 1000)
})

export default function (data) {
  log.info('Update', data)
  autoUpdater.setFeedURL(data.upDateUrl)
  autoUpdater.checkForUpdates().catch(err => {
    log.info('网络连接问题', err)
    Message(5, err.code)
  })
}