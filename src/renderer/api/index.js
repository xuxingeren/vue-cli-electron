import request from './request'
import modules from './modules'

export default function (name, params, other = {}) {
  if (name.slice(0, 4) === 'http') {
    const arg = {
      url: name,
      params,
      other
    }
    return request(arg)
  } else {
    const paths = name.split('.')
    let apiArgs = modules
    paths.forEach(item => {
      if (typeof apiArgs === 'undefined') {
        throw Error('无对应接口')
      }
      apiArgs = apiArgs[item]
    })
    if (typeof apiArgs === 'object' && apiArgs.method && apiArgs.url) {
      const arg = {
        method: apiArgs.method,
        url: apiArgs.url,
        params,
        other
      }
      return request(arg)
    }
    throw Error('请求基础数据缺少', name)
  }
}
