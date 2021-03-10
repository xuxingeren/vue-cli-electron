import { ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer
window.IS_ELECTRON = JSON.parse(process.env.IS_ELECTRON)