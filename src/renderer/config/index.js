// 配置编译环境和线上环境之间的切换
const env = process.env

const config = {
  host: '',
  port: '',
  baseUrl: '',
  gameDevTools: false, // 开启游戏控制台
}

Object.assign(config, env)

// if (env.NODE_ENV === 'development') {
//   config.ELECTRON_ENV = 'test'
// }

if (config.ELECTRON_ENV === 'development') {
  config.host = 'http://192.168.148.174:8080'
  config.meetingWebUrl = 'http://jyhdosmain.sjyt.net'
  config.websocketLink = 'wss://game-socket-dev.jingyuhuodong.com/ws'
} else if (config.ELECTRON_ENV === 'test') {
  config.host = 'https://periphery.jyhd.sjyt.net'
  config.meetingWebUrl = 'http://jyhdosmaintest.sjyt.net'
  config.websocketLink = 'wss://testsocket.jingyuhuodong.com/ws'
} else if (config.ELECTRON_ENV === 'production') {
  config.host = 'https://activity.jingyuhuodong.com/api'
  config.meetingWebUrl = 'https://activity.jingyuhuodong.com'
  config.websocketLink = 'wss://testsocket.jingyuhuodong.com/ws'
}

export default config
