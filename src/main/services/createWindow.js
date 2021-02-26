import { BrowserWindow } from 'electron'

function createWindow(winConfig, devPath, prodPath) {
  const win = new BrowserWindow(winConfig)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
  } else {
    win.loadURL(`app://./${prodPath}`)
  }
  return win
}

export default createWindow