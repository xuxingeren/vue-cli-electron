const files = require.context('./', false, /\.js$/)
const routes = []
files.keys().forEach(key => {
  if (key === './index.js') return
  routes.push(...files(key).default)
})

export default routes