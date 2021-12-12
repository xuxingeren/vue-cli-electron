var sudo = require('sudo-prompt')
var options = {
  name: 'Electron',
}

export default (shell) => {
  return new Promise((resolve, reject) => {
    sudo.exec(shell, options, function(error, stdout, stderr) {
      if (error) {
        reject(error)
        console.log('error:' + error)
        return
      }
      resolve(stdout)
      console.log('stdout: ' + stdout)
    })
  })
}
