import storage from 'good-storage'
import { getSongImg, PLAY_HISTORY_KEY } from '@/utils'


export default {
  // 整合歌曲信息 并且开始播放
  async startSong({ commit, state }, rawSong) {
    // 浅拷贝一份 改变引用
    // 1.不污染元数据
    // 2.单曲循环为了触发watch
    const song = Object.assign({}, rawSong)
    // 如果歌曲不存在img图片
    if (!song.img) {
      // 则从歌曲封面id中获取封面
      if (song.albumId) {
        song.img = await getSongImg(song.id, song.albumId)
      }
    }
    // 将歌曲设为当前播放的音乐
    commit('setCurrentSong', song)
    // 当前播放歌曲的播放状态设置为播放
    commit('setPlayingState', true)

    // 历史记录
    const { playHistory } = state
    const playHistoryCopy = playHistory.slice()
    const findedIndex = playHistoryCopy.findIndex(({ id }) => song.id === id)
    if (findedIndex !== -1) {
      // 删除旧那一项, 插入到最前面
      playHistoryCopy.splice(findedIndex, 1)
    }
    playHistoryCopy.unshift(song)
    commit('setPlayHistory', playHistoryCopy)
    storage.set(PLAY_HISTORY_KEY, playHistoryCopy)
  },

  // 去除当前播放歌曲
  clearCurrentSong({ commit }) {
    // 设置当前播放歌曲为空
    commit('setCurrentSong', {})
    // 设置当前播放歌曲的播放状态为暂停
    commit('setPlayingState', false)
    // 设置当前播放歌曲的时长为0
    commit('setCurrentTime', 0)
  },

  // 清除当前播放列表
  clearPlaylist({ commit, dispatch }) {
  // 设置当前播放列表为空
    commit('setPlaylist', [])
    // 去除当前播放歌曲
    dispatch('clearCurrentSong')
  },

  // 清除当前播放历史记录
  clearHistory({ commit }) {
    // 定义一个空的历史记录
    const history = []
    // 设置播放历史数据为空
    commit('setPlayHistory', history)
    // 将历史数据添加到storage中，方便渲染到页面中
    storage.set(PLAY_HISTORY_KEY, history)
  },

  // 将歌曲添加到播放列表
  addToPlaylist({ commit, state }, song) {
    // 获取当前播放列表
    const { playlist } = state
    // 将播放列表拷贝一份
    const copy = playlist.slice()
    // 如果歌曲在当前播放列表中不存在
    if (!copy.find(({ id }) => id === song.id)) {
      // 将歌曲加入到播放列表
      copy.unshift(song)
      // 重新设置新的播放列表
      commit('setPlaylist', copy)
    }
  }
}
