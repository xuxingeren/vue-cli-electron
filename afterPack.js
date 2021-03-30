const path = require('path')
const AdmZip = require('adm-zip')

exports.default = async function(context) {
  const unpacked = path.join(context.appOutDir, './resources/app.asar.unpacked')
  var zip = new AdmZip()
  zip.addLocalFolder(unpacked)
  zip.writeZip(path.join(context.outDir, 'unpacked.zip'))
}