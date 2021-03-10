import { Tray, nativeImage, Menu, app } from 'electron'
const isMac = process.platform === 'darwin'
const path = require('path')
let tray = null

export default function (win) {
  const iconType = isMac ? '16x16.png' : 'icon.ico'
  const icon = path.join(__static, `./icons/${iconType}`)
  const image = nativeImage.createFromPath(icon)
  if (isMac) {
    image.setTemplateImage(true)
  }
  tray = new Tray(image)
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
    tray.on('click', () => {
      winShow(win)
    })
  }
  tray.setToolTip('vue-cli-electron')
  tray.setContextMenu(contextMenu)
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