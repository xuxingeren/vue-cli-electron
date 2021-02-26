import log from 'electron-log'

log.transports.file.level = 'silly'
log.transports.console.level = false // 禁用console输出

export default log
