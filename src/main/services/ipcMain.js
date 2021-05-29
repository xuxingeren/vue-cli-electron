import { ipcMain, app, screen, globalShortcut } from 'electron'
import global from '../config/global'
import setTray from './setTray'
import checkUpdate from './checkUpdate'
import increment from '../utils/increment'
import createWindow from './createWindow'
import path from 'path'

export default function () {
  const win = global.sharedObject.win
  const isMac = process.platform === 'darwin'
  ipcMain.handle('win-close', (_, data) => {
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
  ipcMain.handle('win-message', (_, data) => {
    setTray.flash(data)
  })
  ipcMain.handle('win-update', (_, data) => {
    checkUpdate(data)
  })
  ipcMain.handle('win-increment', (_, data) => {
    increment(data)
  })
  ipcMain.handle('win-envConfig', (_, data) => {
    global.envConfig = data
  })
  ipcMain.handle('win-globalShortcut', (_, data) => {
    if (data) {
      globalShortcut.register('Ctrl+F', () => {
        win.webContents.send('renderer-globalShortcut', 'Ctrl+F')
      })
    } else {
      globalShortcut.unregister('Ctrl+F')
    }
  })
  ipcMain.handle('win-subScreen-message', (_, data) => {
    if (global.sharedObject.subScreen) {
      global.sharedObject.subScreen.webContents.send('renderer-subScreen-message', data)
    }
  })
  ipcMain.handle('win-subScreen', (_, data) => {
    if (data.open) {
      const displays = screen.getAllDisplays()
      const mainBounds = win.getNormalBounds()
      const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
      })
      if (externalDisplay) {
        if (global.sharedObject.subScreen) {
          global.sharedObject.subScreen.show()
        } else {
          global.sharedObject.subScreen = createWindow({
            frame: false,
            show: false,
            parent: win, // win是主窗口
            fullscreen: true,
            webPreferences: {
              webSecurity: false,
              contextIsolation: false,
              enableRemoteModule: true,
              nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
              plugins: true,
              preload: path.join(__dirname, 'preload.js'),
              devTools: false
            },
            x: mainBounds.x < 0 && Math.abs(mainBounds.x) > (win.getContentSize()[0] / 2) ? 0 : externalDisplay.bounds.x,
            y: externalDisplay.bounds.y
          }, data.path, `index.html${data.path}`)
          global.sharedObject.subScreen.once('ready-to-show', () => {
            global.sharedObject.subScreen.show()
          })
          global.sharedObject.subScreen.on('closed', () => {
            global.sharedObject.subScreen = null
          })
        }
      } else {
        console.log('未检测到拓展屏')
      }
    } else {
      global.sharedObject.subScreen && global.sharedObject.subScreen.destroy()
    }
  })
}
