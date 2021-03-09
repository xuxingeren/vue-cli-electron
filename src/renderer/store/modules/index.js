const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  const moduleName = key.replace(/(\.\/|\.js)/g, '')
  modules[moduleName] = files(key).default
  modules[moduleName].namespaced = true
})

export default modules
