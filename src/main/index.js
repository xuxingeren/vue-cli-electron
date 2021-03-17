'use strict'

import { app, protocol } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension from 'electron-devtools-installer'
import path from 'path'
import createWindow from './services/createWindow'
import winSingle from './services/winSingle'
import setTray from './services/setTray'
import ipcMain from './services/ipcMain'
import config from './config/index'
import global from './config/global'
import setMenu from './config/menu'

const isMac = process.platform === 'darwin'
const isDevelopment = process.env.NODE_ENV !== 'production'

let win = null
let loaderWin = null
let willQuitApp = false

// 注册文件加载策略
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

if (config.winSingle) {
  winSingle()
}

function initWindow() {
  if (config.loading) {
    loaderWin = createWindow({
      width: 400,
      height: 600,
      frame: false,
      backgroundColor: '#222',
      show: false,
      transparent: true,
      skipTaskbar: true,
      resizable: false,
      webPreferences: {
        experimentalFeatures: true,
        contextIsolation: false
      }
    }, 'loader', 'loader.html')
    loaderWin.once('ready-to-show', () => {
      loaderWin.show()
    })
    loaderWin.on('closed', () => {
      loaderWin = null
    })
  }
  win = createWindow({
    height: 810,
    minHeight: !isMac && process.env.VUE_APP_ENV === 'production' ? 810 - 20 : 810,
    width: 1440,
    minWidth: 1440,
    useContentSize: true,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
      scrollBounce: isMac
    }
  }, '', 'index.html')

  global.sharedObject.win = win
  ipcMain()
  setMenu(win)
  setTray.init(win)
  win.once('ready-to-show', () => {
    loaderWin && loaderWin.destroy()
    win.show()
  })
  win.on('enter-full-screen', () => {
    isMac && app.commandLine.appendSwitch('disable-pinch', true)
  })
  win.on('leave-full-screen', () => {
    isMac && app.commandLine.appendSwitch('disable-pinch', false)
  })
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyUp') {
      if (input.key.toLowerCase() === 'f11') {
        win.setFullScreen(!win.isFullScreen())
      }
    }
  })
  win.on('closed', () => {
    win = null
    global.sharedObject.win = null
  })
}

async function onAppReady() {
  if (!process.env.WEBPACK_DEV_SERVER_URL) {
    createProtocol('app')
  }

  initWindow()

  // if (isDevelopment && !process.env.IS_TEST) {
  //   try {
  //     await installExtension({
  //       id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
  //       electron: '>=1.2.1'
  //     })
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  win.on('close', (e) => {
    console.log('close', willQuitApp)
    if (!willQuitApp) {
      win.webContents.send('win-close-tips', { isMac })
      e.preventDefault()
    }
  })
  win.on('focus', () => {
    win.webContents.send('win-focus')
  })
}
app.setAppUserModelId(config.VUE_APP_APPID)
app.isReady() ? onAppReady() : app.on('ready', onAppReady)
app.on('activate', () => win.show())
app.on('before-quit', () => {
  console.log('before-quit')
  willQuitApp = true
})
app.on('quit', () => {
  console.log('quit')
})
app.on('window-all-closed', () => {
  console.log('window-all-closed')
  if (!isMac) {
    app.quit()
  }
})
app.on('browser-window-created', () => {
  console.log('window-created')
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}