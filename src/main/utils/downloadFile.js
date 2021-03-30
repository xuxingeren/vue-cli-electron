const request = require('request')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

function download(url, targetPath, cb = () => { }) {
  let status
  const req = request({
    method: 'GET',
    uri: encodeURI(url)
  })
  try {
    const stream = fs.createWriteStream(targetPath)
    let len = 0
    let cur = 0
    req.pipe(stream)
    req.on('response', (data) => {
      len = parseInt(data.headers['content-length'])
    })
    req.on('data', (chunk) => {
      cur += chunk.length
      const progress = (100 * cur / len).toFixed(2)
      status = 'progressing'
      cb(status, progress)
    })
    req.on('end', function () {
      if (req.response.statusCode === 200) {
        if (len === cur) {
          console.log(targetPath + ' Download complete ')
          status = 'completed'
          cb(status, 100)
        } else {
          stream.end()
          removeFile(targetPath)
          status = 'error'
          cb(status, '网络波动，下载文件不全')
        }
      } else {
        stream.end()
        removeFile(targetPath)
        status = 'error'
        cb(status, req.response.statusMessage)
      }
    })
    req.on('error', (e) => {
      stream.end()
      removeFile(targetPath)
      if (len !== cur) {
        status = 'error'
        cb(status, '网络波动，下载失败')
      } else {
        status = 'error'
        cb(status, e)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

function removeFile(targetPath) {
  try {
    fse.removeSync(targetPath)
  } catch (error) {
    console.log(error)
  }
}

export default async function downloadFile({ url, targetPath, folder = './' }, cb = () => { }) {
  if (!targetPath || !url) {
    throw new Error('targetPath or url is nofind')
  }
  try {
    await fse.ensureDirSync(path.join(targetPath, folder))
  } catch (error) {
    throw new Error(error)
  }
  return new Promise((resolve, reject) => {
    const name = url.split('/').pop()
    const filePath = path.join(targetPath, folder, name)
    download(url, filePath, (status, result) => {
      if (status === 'completed') {
        resolve(filePath)
      }
      if (status === 'error') {
        reject(result)
      }
      if (status === 'progressing') {
        cb && cb(result)
      }
    })
  })
}