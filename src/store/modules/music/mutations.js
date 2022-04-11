import { shallowEqual } from '@/utils'

export default {
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
  }
}