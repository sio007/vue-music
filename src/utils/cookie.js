/**
 * 添加cookie
 * @param {String} objName
 * @param {String} objValue
 * @param {Number} objHours
 */
export function addCookie(objName, objValue, objHours = 24) {
  if (objHours > 0) { // 如果不设定过期时间, 浏览器关闭时cookie会自动消失
    var date = new Date()
    var ms = objHours * 3600 * 1000

    date.setTime(date.getTime() + ms)
    document.cookie = objName + '=' + objValue + '; expires=' + date.toGMTString() + '; path=/;' // 指定了cookie的path
  }
}

/**
 * 获取Cookie中的值
 * @param objName
 */
export function getCookie(objName) {
  let arrStr = document.cookie.split('; ')
  for (let i = 0; i < arrStr.length; i++) {
    let temp = arrStr[i].split('=')
    if (temp[0] == objName) {
      return temp[1]
    }
  }
}

/**
 * 清除cookie
 */
export function clearAllCookie() {
  // eslint-disable-next-line no-useless-escape
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (let i = keys.length; i--;) {
      document.cookie = keys[i] + '=' + '; path=/'
    }
  }
}
