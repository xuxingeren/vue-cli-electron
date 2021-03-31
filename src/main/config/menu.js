import { app, dialog, Menu } from 'electron'
import config from './index'
import global from './global'
const os = require('os')
const isMac = process.platform === 'darwin'

const menuConfig = [
  {
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
  }, {
    label: '帮助',
    submenu: [{
      label: '关于',
      click: function () {
        info()
      }
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
      menu = Menu.buildFromTemplate([{
        label: app.name,
        submenu: [{
          label: '关于',
          click: function () {
            dialog.showMessageBox({
              title: '关于',
              type: 'info',
              message: 'vue-cli-electron',
              detail: `当前版本：${process.env.VERSION}`,
              noLink: true,
              buttons: ['确定']
            })
          }
        }, {
          label: '隐藏vue-cli-electron',
          role: 'hide'
        }, {
          label: '隐藏其他',
          role: 'hideothers'
        }, {
          label: '显示全部',
          role: 'unhide'
        }, {
          label: '退出',
          role: 'quit'
        }]
      }, {
        label: '窗口',
        submenu: [{
          label: '打开窗口',
          id: 'showWindow',
          enabled: false,
          click: function () {
            win.show()
          }
        }, {
          label: '全屏切换',
          role: 'togglefullscreen'
        }, {
          label: '最小化',
          role: 'minimize'
        }, {
          label: '关闭',
          role: 'close'
        }]
      }])
      Menu.setApplicationMenu(menu)
    } else {
      Menu.setApplicationMenu(null)
    }
    win.webContents.openDevTools({ mode: 'detach' })
    // win.webContents.closeDevTools()
  }
}


export default setMenu
