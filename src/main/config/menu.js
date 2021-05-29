import { app, dialog, Menu } from 'electron'
import config from './index'
import global from './global'
const os = require('os')
const isMac = process.platform === 'darwin'

const menuConfig = [{
  label: app.name,
  submenu: [{
    label: '关于',
    accelerator: isMac ? 'Alt+Cmd+I' : 'Alt+Shift+I',
    click: function () {
      info()
    }
  }]
}, {
  label: '设置',
  submenu: [{
    label: '快速重启',
    accelerator: 'CmdOrCtrl+F5',
    role: 'reload'
  }, {
    label: '退出',
    accelerator: 'CmdOrCtrl+Q',
    role: 'quit'
  }]
}, {
  label: '开发者设置',
  submenu: [{
    label: '切换到开发者模式',
    accelerator: 'CmdOrCtrl+I',
    role: 'toggledevtools'
  }]
}]

function info() {
  dialog.showMessageBox({
    title: '关于',
    type: 'info',
    message: 'vue-cli-electron',
    // detail: `版本信息：\nelectron版本：${process.versions.electron}\n当前系统：${os.type()} ${os.arch()} ${os.release()}\n当前版本：${process.env.VUE_APP_ENV}，${process.env.VUE_APP_VERSION}`,
    detail: `版本信息：\nelectron版本：${process.versions.electron}\n当前系统：${os.type()} ${os.arch()} ${os.release()}\n当前版本：${global.envConfig.VUE_APP_ENV}，${global.envConfig.VUE_APP_VERSION}`,
    noLink: true,
    buttons: ['确定']
  })
}

function setMenu(win) {
  let menu
  if (config.devToolsShow) {
    menu = Menu.buildFromTemplate(menuConfig)
    Menu.setApplicationMenu(menu)
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    if (isMac) {
      menu = Menu.buildFromTemplate(menuConfig)
      Menu.setApplicationMenu(menu)
    } else {
      Menu.setApplicationMenu(null)
    }
    win.webContents.openDevTools({ mode: 'detach' })
    // win.webContents.closeDevTools()
  }
}


export default setMenu
