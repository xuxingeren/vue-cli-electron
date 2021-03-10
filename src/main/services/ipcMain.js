import { ipcMain, app } from 'electron'
import global from '../config/global'

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
}
