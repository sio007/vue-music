import storage from 'good-storage'
import { PLAY_HISTORY_KEY } from '@/utils'
import { playModeMap } from '@/utils/config'

export default {
  // 当前播放歌曲
  currentSong: {},
  // 当前播放时长
  currentTime: 0,
  // 播放状态
  playing: false,
  // 播放模式
  playMode: playModeMap.sequence.code,
  // 播放列表显示状态
  isPlaylistShow: false,
  // 播放提示显示状态
  isPlaylistPromptShow: false,
  // 歌曲详情页显示
  isPlayerShow: false,
  // 播放列表数据
  playlist: [],
  // 播放历史数据
  playHistory: storage.get(PLAY_HISTORY_KEY, []),
  // 菜单显示状态
  isMenuShow: true,
  // mini播放器显示状态
  isMiniPlayerShow: true
}
