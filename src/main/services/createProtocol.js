import { protocol } from 'electron'
import * as path from 'path'
import { readFile } from 'fs'
import { URL } from 'url'
import log from '../config/log.js'

export default (scheme, serverPath = __dirname) => {
  protocol.registerBufferProtocol(
    scheme,
    (request, respond) => {
      let pathName = new URL(request.url).pathname
      pathName = decodeURI(pathName) // Needed in case URL contains spaces
      log.info(path.join(serverPath, pathName))
      readFile(path.join(serverPath, pathName), (error, data) => {
        if (error) {
          log.error(error)
          console.error(
            `Failed to read ${pathName} on ${scheme} protocol`,
            error
          )
        }
        const extension = path.extname(pathName).toLowerCase()
        let mimeType = ''

        if (extension === '.js') {
          mimeType = 'text/javascript'
        } else if (extension === '.html') {
          mimeType = 'text/html'
        } else if (extension === '.css') {
          mimeType = 'text/css'
        } else if (extension === '.svg' || extension === '.svgz') {
          mimeType = 'image/svg+xml'
        } else if (extension === '.json') {
          mimeType = 'application/json'
        } else if (extension === '.wasm') {
          mimeType = 'application/wasm'
        }

        respond({ mimeType, data })
      })
    },
    (error) => {
      if (error) {
        console.error(`Failed to register ${scheme} protocol`, error)
      }
    }
  )
}
