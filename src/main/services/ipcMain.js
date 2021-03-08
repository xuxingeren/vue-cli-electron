import { ipcMain, app } from 'electron'
import global from '../config/global'

export default function () {
  const win = global.sharedObject.win
  const isMac = process.platform === 'darwin'
  ipcMain.handle('win-close', (event, data) => {
    if (data === 1) {
      if (isMac && win.isFullScreen()) {
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
      if (isMac) {
        app.quit()
      } else {
        win.destroy()
      }
    }
  })
  ipcMain.handle('win-focus', () => {
    if (win.isMinimized()) {
      win.restore()
      win.focus()
    }
  })
}
