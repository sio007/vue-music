import storage from 'good-storage'
import { UID_KEY, UID_COOKIE, notify, isDef, clearAllCookie } from '@/utils'
// 导入获取用户信息和用户歌单信息的请求方法
import { getUserDetail, getUserPlaylist } from '@/api'

export default {
  // 加载用户信息和用户歌单信息
  async userData({ commit }, uid) {
    // 定义一个错误消息
    const error = () => {
      notify.error('登录失败')
      return false
    }
    // 如果不存在uid,说明用户还未登录,返回错误消息
    if (!isDef(uid)) {
      return error()
    }
    // 发送获取用户信息请求
    try {
      const user = await getUserDetail(uid)
      // 将获取的数据作为参数传递到设置用户详细信息方法中
      const { profile } = user
      commit('setUser', profile)
      // 并将数据中的uid保存到storage中
      storage.set(UID_KEY, profile.userId)
    } catch (e) {
      // 如果以上捕获到错误,返回错误消息
      return error()
    }
    // 发送获取用户歌单信息
    const { playlist } = await getUserPlaylist(uid)
    // 将获取的数据作为参数传递到设置用户歌单信息方法中
    commit('setUserPlaylist', playlist)
    return true
  },
  // 注销用户方法
  logout({ commit }) {
    // 设置用户详细信息为空
    commit('setUser', {})
    // 设置用户歌单信息为空
    commit('setUserPlaylist', [])
    // 将保存中storage中的uid和cookie都置空
    storage.set(UID_KEY, null)
    clearAllCookie()
  }
}
