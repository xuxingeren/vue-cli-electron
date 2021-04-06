const fs = require('fs')
const path = require('path')
const { execFile } = require('child_process')
const { resourcesPath, exePath } = JSON.parse(process.argv[2])

const fun = function () {
  execFile(exePath, function (err, data) {
    if (err) {
      console.error(err)
      return
    }
    console.log(data.toString())
  })
}

setTimeout(() => {
  try {
    fs.renameSync(path.join(resourcesPath, './update.asar'), path.join(resourcesPath, './app.asar'))
    console.log('替换成功')
    fun()
  } catch (error) {
    console.error(error)
  }
}, 500)