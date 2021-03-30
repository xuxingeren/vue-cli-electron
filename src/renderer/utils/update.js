export default (version, data) => {
  return new Promise((resolve, reject) => {
    const isUpdate = data ? versionCompare(data.version, version) : 0
    switch (isUpdate) {
      case 0:
        console.log('不更新')
        reject({ code: isUpdate })
        break;
      case 1:
        if (data.fullUpdate) {
          console.log('全量更新')
          resolve()
        } else {
          console.log('增量更新')
          resolve()
        }
        break
      case -1:
        console.log('降级')
        reject({ code: isUpdate })
        break
    }
  })
}


// 1为当前版本比更新版本低，0为版本一致，-1为当前版本比更新版本高
function versionCompare(stra, strb) {
  const straArr = stra.split('.')
  const strbArr = strb.split('.')
  const maxLen = Math.max(straArr.length, strbArr.length)
  let result
  let sa
  let sb
  for (let i = 0; i < maxLen; i++) {
    sa = ~~straArr[i]
    sb = ~~strbArr[i]
    if (sa > sb) {
      result = 1
    } else if (sa < sb) {
      result = -1
    } else {
      result = 0
    }
    if (result !== 0) {
      return result
    }
  }
  return result
}
