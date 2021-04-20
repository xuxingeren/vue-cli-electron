// import downloadFile from './downloadFile'
// import global from '../config/global'
// import { app } from 'electron'
// const path = require('path')
// const fse = require('fs-extra')
// const AdmZip = require('adm-zip')

// export default (data) => {
//   const resourcesPath = process.resourcesPath
//   const unpackedPath = path.join(resourcesPath, './app.asar.unpacked')
//   downloadFile({ url: data.upDateUrl, targetPath: resourcesPath }).then(async (filePath) => {
//     backups(unpackedPath)
//     const zip = new AdmZip(filePath)
//     zip.extractAllToAsync(unpackedPath, true, (err) => {
//       if (err) {
//         console.error(err)
//         reduction(unpackedPath)
//         return
//       }
//       fse.removeSync(filePath)
//       if (data.restart) {
//         reLoad(true)
//       } else {
//         reLoad(false)
//       }
//     })
//   }).catch(err => {
//     console.log(err)
//   })
// }

// function backups(targetPath) {
//   if (fse.pathExistsSync(targetPath + '.back')) { // 删除旧备份
//     fse.removeSync(targetPath + '.back')
//   }
//   if (fse.pathExistsSync(targetPath)) {
//     fse.moveSync(targetPath, targetPath + '.back') // 备份目录
//   }
// }

// function reduction(targetPath) {
//   if (fse.pathExistsSync(targetPath + '.back')) {
//     fse.moveSync(targetPath + '.back', targetPath)
//   }
//   reLoad(false)
// }

// function reLoad(close) {
//   if (close) {
//     app.relaunch()
//     app.exit(0)
//   } else {
//     global.sharedObject.win.webContents.reloadIgnoringCache()
//   }
// }
import downloadFile from './downloadFile'
import { app } from 'electron'
const fse = require('fs-extra')
const path = require('path')
const AdmZip = require('adm-zip')

export default async (data) => {
  const resourcesPath = process.resourcesPath
    if (!fse.pathExistsSync(path.join(app.getPath('userData'), './update.exe'))) {
      await downloadFile({ url: data.upDateExe, targetPath: app.getPath('userData') })
    }
    downloadFile({ url: data.upDateUrl, targetPath: resourcesPath }).then(async (filePath) => {
      const zip = new AdmZip(filePath)
      zip.extractAllToAsync(resourcesPath, true, (err) => {
        if (err) {
          console.error(err)
          return
        }
        fse.removeSync(filePath)
        app.exit(0)
      })
    }).catch(err => {
      console.log(err)
    })
}