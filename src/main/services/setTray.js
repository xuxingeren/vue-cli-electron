import { Tray, nativeImage, Menu, app, Notification } from 'electron'
import global from '../config/global'
const isMac = process.platform === 'darwin'
const path = require('path')
let notification

function winShow(win) {
  if (win.isVisible()) {
    if (win.isMinimized()) {
      win.restore()
      win.focus()
    } else {
      win.focus()
    }
  } else {
    !isMac && win.minimize()
    win.show()
    win.setSkipTaskbar(false)
  }
}
class createTray {
  constructor() {
    const iconType = isMac ? '16x16.png' : 'icon.ico'
    const icon = path.join(__static, `./icons/${iconType}`)
    this.image = nativeImage.createFromPath(icon)
    this.count = 0
    this.flickerTimer = null
    if (isMac) {
      this.image.setTemplateImage(true)
    }
  }
  init(win) {
    global.tray = new Tray(this.image)
    let contextMenu = Menu.buildFromTemplate([
      {
        label: '显示vue-cli-electron',
        click: () => {
          winShow(win)
        }
      }, {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])
    if (!isMac) {
      global.tray.on('click', () => {
        if (this.count !== 0) {
          win.webContents.send('renderer-message-read')
        }
        winShow(win)
      })
    }
    global.tray.setToolTip('vue-cli-electron')
    global.tray.setContextMenu(contextMenu)
  }
  flash({ flashFrame, messageConfig }) {
    global.sharedObject.win.flashFrame(flashFrame)
    if (isMac && messageConfig) {
      global.tray.setTitle(messageConfig.news === 0 ? '' : messageConfig.news+ '')
      app.dock.setBadge(messageConfig.news === 0 ? '' : messageConfig.news+ '')
    }
    if (messageConfig.news !== 0) {
      if (!this.flickerTimer && !isMac) {
        this.flickerTimer = setInterval(() => {
          global.tray.setImage(this.count++ % 2 === 0 ? this.image : nativeImage.createFromPath(null))
        }, 500)
      }
      if (messageConfig.body) {
        notification = new Notification(messageConfig)
        notification.once('click', () => {
          winShow(global.sharedObject.win)
          global.sharedObject.win.webContents.send('renderer-message-read', messageConfig.id)
          notification.close()
        })
        notification.show()
      }
    } else {
      this.count = 0
      if (this.flickerTimer) {
        clearInterval(this.flickerTimer)
        this.flickerTimer = null
      }
      global.tray.setImage(this.image)
    }
  }
}

export default new createTray()