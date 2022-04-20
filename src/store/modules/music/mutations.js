import { shallowEqual } from '@/utils'


export default {
  // 设置当前播放歌曲
  setCurrentSong(state, song) {
    state.currentSong = song
  },

  // 设置当前播放歌曲的时长
  setCurrentTime (state, time) {
    state.currentTime = time
  },

  // 设置当前播放歌曲的播放状态
  setPlayingState(state, playing) {
    state.playing = playing
  },

  // 设置当前的播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },

  // 设置播放列表的显示状态
  setPlaylistShow(state, show) {
    state.isPlaylistShow = show
  },

  // 设置当前歌曲详情页显示状态
  setPlayerShow(state, show) {
    state.isPlayerShow = show
  },

  // 设置播放提示显示状态
  setPlaylistPromptShow(state, show) {
    state.isPlaylistPromptShow = show
  },

  // 设置当前播放列表
  setPlaylist(state, playlist) {
    const { isPlaylistShow, playlist: oldPlaylist } = state
    state.playlist = playlist
    // 播放列表未显示 并且两次播放列表的不一样 则弹出提示
    if (!isPlaylistShow && !shallowEqual(oldPlaylist, playlist, 'id')) {
      state.isPlaylistPromptShow = true
      setTimeout(() => {
        state.isPlaylistPromptShow = false
      }, 2000)
    }
  },

  // 设置播放历史数据
  setPlayHistory(state, history) {
    state.playHistory = history
  },

  // 设置菜单显示状态
  setMenuShow(state, show) {
    state.isMenuShow = show
  },

  // 设置mini播放器显示状态
  setMiniPlayerShow(state, show) {
    state.isMiniPlayerShow = show
  }
}
