'use strict'

import { app, protocol } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension from 'electron-devtools-installer'
import createWindow from './services/createWindow'
import winSingle from './services/winSingle'
import setTray from './services/setTray'
import config from './config/index'
import global from './config/global'
import setMenu from './config/menu'

const isMac = process.platform === 'darwin'
const isDevelopment = process.env.NODE_ENV !== 'production'

let win = null
let loaderWin = null

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
      transparent: true,
      skipTaskbar: true,
      resizable: false,
      webPreferences: {
        experimentalFeatures: true,
        contextIsolation: false
      }
    }, 'loader', 'loader.html')
    loaderWin.on('closed', () => {
      loaderWin = null
    })
  }

  win = createWindow({
    height: 810,
    minHeight: process.env.VUE_APP_ENV === 'production' ? 810 : 830,
    width: 1440,
    minWidth: 1440,
    useContentSize: true,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegrationInSubFrames: true,
      webSecurity: false,
      webviewTag: true,
      enableRemoteModule: true,
      scrollBounce: isMac
    }
  }, '', 'index.html')

  global.sharedObject.win = win

  setMenu(win)
  setTray(win)
  win.webContents.once('dom-ready', () => {
    loaderWin && loaderWin.destroy()
    win.show()
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

  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension({
        id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
        electron: '>=1.2.1'
      })
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  win.on('close', (e) => {
    if (global.willQuitApp) {
      app.quit()
    } else {
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
      e.preventDefault()
    }
  })
}



app.isReady() ? onAppReady() : app.on('ready', onAppReady)
app.on('activate', () => win.show())
app.on('before-quit', () => {
  global.willQuitApp = true
})
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})
app.on('browser-window-created', () => {
  console.log('window-created')
})

// if (isDevelopment) {
//   if (process.platform === 'win32') {
//     process.on('message', data => {
//       if (data === 'graceful-exit') {
//         app.quit()
//       }
//     })
//   } else {
//     process.on('SIGTERM', () => {
//       app.quit()
//     })
//   }
// }