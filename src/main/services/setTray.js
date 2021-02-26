import { Tray, nativeImage, Menu } from 'electron'
import global from '../config/global.js'
const isMac = process.platform === 'darwin'
const path = require('path')
let tray = null

export default function(win) {
  const iconType = isMac ? '16x16.png' : 'icon.ico'
  const icon = path.join(__static, `./icons/${iconType}`)
  const image = nativeImage.createFromPath(icon)
  if (isMac) {
    image.setTemplateImage(true)
  }
  tray = new Tray(image)
  let contextMenu
  if (isMac) {
    contextMenu = Menu.buildFromTemplate([
      {
        label: '显示鲸鱼活动',
        click: () => {
          win.show()
          win.setSkipTaskbar(false)
        }
      }, {
        label: '退出',
        click: () => {
          global.willQuitApp = true
          win.close()
        }
      }
    ])
  } else {
    contextMenu = Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => {
          win.destroy()
        }
      }
    ])
    tray.on('click', () => {
      win.show()
      win.setSkipTaskbar(false)
    })
  }
  tray.setToolTip('鲸鱼活动')
  tray.setContextMenu(contextMenu)
}