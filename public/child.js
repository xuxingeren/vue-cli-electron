const fs = require('fs')
const path = require('path')
const { execFile } = require('child_process')
const { resourcesPath, logPath, exePath } = JSON.parse(process.argv[2])

const fun = function () {
  execFile(exePath, function (err, data) {
    console.log(err)
    console.log(data.toString())
  })
}

setTimeout(() => {
  try {
    fs.renameSync(path.join(resourcesPath, './update.asar'), path.join(resourcesPath, './app.asar'))
    fun()
  } catch (error) {
    fs.appendFileSync(path.join(logPath, './child.log'), error, (err) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('写入成功')
    })
  }
}, 500)