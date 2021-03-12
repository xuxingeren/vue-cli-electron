import { Tray, nativeImage, Menu, app } from 'electron'
import global from '../config/global'
const isMac = process.platform === 'darwin'
const path = require('path')

export default function (win) {
  const iconType = isMac ? '16x16.png' : 'icon.ico'
  const icon = path.join(__static, `./icons/${iconType}`)
  const image = nativeImage.createFromPath(icon)
  if (isMac) {
    image.setTemplateImage(true)
  }
  global.tray = new Tray(image)
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
      winShow(win)
    })
  }
  global.tray.setToolTip('vue-cli-electron')
  global.tray.setContextMenu(contextMenu)
}

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