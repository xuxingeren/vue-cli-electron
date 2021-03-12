import { ipcMain, app, nativeImage } from 'electron'
import global from '../config/global'
const path = require('path')

export default function () {
  const win = global.sharedObject.win
  const isMac = process.platform === 'darwin'
  ipcMain.handle('win-close', (event, data) => {
    if (isMac) {
      if (win.isFullScreen()) {
        win.once('leave-full-screen', function () {
          win.setSkipTaskbar(true)
          win.hide()
        })
        win.setFullScreen(false)
      } else {
        win.setSkipTaskbar(true)
        win.hide()
      }
    } else {
      if (data === 1) {
        win.setSkipTaskbar(true)
        win.hide()
      } else {
        app.quit()
      }
    }
  })
  ipcMain.handle('win-focus', () => {
    if (win.isMinimized()) {
      win.restore()
      win.focus()
    }
  })
  ipcMain.handle('win-message', (data) => {
    let count = 0
    const iconType = isMac ? '16x16.png' : 'icon.ico'
    const icon = path.join(__static, `./icons/${iconType}`)
    const image = nativeImage.createFromPath(icon)
    if (isMac) {
      image.setTemplateImage(true)
    }
    win.flashFrame(data)
    setInterval(function() {
      if (count++ % 2 == 0) {
        global.tray.setImage(image)
      } else {
        global.tray.setImage(nativeImage.createFromPath(null))
      }
  }, 500)
  })
}
