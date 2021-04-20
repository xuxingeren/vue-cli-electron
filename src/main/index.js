'use strict'

import { app, protocol } from 'electron'
import createProtocol from './services/createProtocol'
// import installExtension from 'electron-devtools-installer'
import path from 'path'
import createWindow from './services/createWindow'
import winSingle from './services/winSingle'
import setTray from './services/setTray'
import ipcMain from './services/ipcMain'
import config from './config/index'
import global from './config/global'
import setMenu from './config/menu'
const { spawn } = require('child_process')
const fse = require('fs-extra')
const fs = require('fs')

const isMac = process.platform === 'darwin'
const isDevelopment = process.env.NODE_ENV !== 'production'
const resourcesPath = process.resourcesPath

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
      webSecurity: false,
      contextIsolation: false,
      enableRemoteModule: true,
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
    // createProtocol('app', path.join(resourcesPath, './app.asar.unpacked'))
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
    console.log('close', global.willQuitApp)
    if (!global.willQuitApp) {
      win.webContents.send('renderer-close-tips', { isMac })
      e.preventDefault()
    }
  })
}
app.setAppUserModelId(config.VUE_APP_APPID)
app.isReady() ? onAppReady() : app.on('ready', onAppReady)
// app.whenReady().then(() => {
//   protocol.registerFileProtocol('atom', (request, callback) => {
//     const pathname = decodeURI(request.url.replace('atom:///', ''))
//     const parts = pathname.split('?')
//     callback(parts[0])
//   })
// })
app.on('activate', () => win.show())
app.on('before-quit', () => {
  console.log('before-quit')
  global.willQuitApp = true
})
app.on('quit', () => {
  console.log('quit')
  if (fse.pathExistsSync(path.join(app.getPath('userData'), './update.exe')) && fse.pathExistsSync(path.join(resourcesPath, './update.asar'))) {
    const logPath = app.getPath('logs')
    const out = fs.openSync(path.join(logPath, './out.log'), 'a')
    const err = fs.openSync(path.join(logPath, './err.log'), 'a')
    const child = spawn(`"${path.join(app.getPath('userData'), './update.exe')}"`, [`"${resourcesPath}"`, `"${app.getPath('exe')}"`], {
      detached: true,
      shell: true,
      stdio: ['ignore', out, err]
    })
    child.unref()
  }
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