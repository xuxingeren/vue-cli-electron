import { app } from 'electron'
import global from '../config/global'
const gotTheLock = app.requestSingleInstanceLock()

export default function() {
  // 点击图标启动时检测窗口是否存在，存在则打开
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, argv) => {
      console.log(argv)
      const win = global.sharedObject.win
      win.webContents.send('renderer-scheme', argv[argv.length - 1])
      if (win) {
        if (win.isMinimized()) win.restore()
        if (win.isVisible()) {
          win.focus()
        } else {
          win.show()
          win.setSkipTaskbar(false)
        }
      }
    })
  }
}
