import { isDef, playModeMap } from '@/utils'

// 获取当前播放音乐的id
export const currentIndex = (state) => {
  const { currentSong, playlist } = state
  return playlist.findIndex(({ id }) => id === currentSong.id)
}

// 下一首歌
export const nextSong = (state, getters) => {
  // 获取当前播放列表和当前播放模式
  const { playlist, playMode } = state
  // 播放模式的三种情况分别调用不同的函数
  const nextStratMap = {
    [playModeMap.sequence.code]: getSequenceNextIndex,
    [playModeMap.loop.code]: getLoopNextIndex,
    [playModeMap.random.code]: getRandomNextIndex
  }
  // 根据模式调用函数
  const getNextStrat = nextStratMap[playMode]
  // 获取函数返回的下一首歌曲的索引
  const index = getNextStrat()

  // 将播放列表中下一首歌曲返回
  return playlist[index]

  // 顺序播放
  function getSequenceNextIndex() {
    let nextIndex = getters.currentIndex + 1
    if (nextIndex > playlist.length - 1) {
      nextIndex = 0
    }
    return nextIndex
  }

  // 随机播放
  function getRandomNextIndex() {
    return getRandomIndex(playlist, getters.currentIndex)
  }

  // 单曲循环
  function getLoopNextIndex() {
    return getters.currentIndex
  }
}

// 上一首歌
export const prevSong = (state, getters) => {
  // 获取当前播放列表和当前播放模式
  const { playlist, playMode } = state
  // 播放模式的三种情况分别调用不同的函数
  const prevStratMap = {
    [playModeMap.sequence.code]: getSequencePrevIndex,
    [playModeMap.loop.code]: getLoopPrevIndex,
    [playModeMap.random.code]: getRandomPrevIndex
  }
  // 根据模式调用函数
  const getPrevStrat = prevStratMap[playMode]
  // 获取函数返回的上一首歌曲的索引
  const index = getPrevStrat()
  // 将播放列表中上一首歌曲返回
  return playlist[index]

  // 顺序播放
  function getSequencePrevIndex() {
    let prevIndex = getters.currentIndex - 1
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1
    }
    return prevIndex
  }

  // 单曲循环
  function getLoopPrevIndex() {
    return getters.currentIndex
  }

  // 随机播放
  function getRandomPrevIndex() {
    return getRandomIndex(playlist, getters.currentIndex)
  }
}

// 当前是否有歌曲在播放
export const hasCurrentSong = (state) => {
  return isDef(state.currentSong.id)
}

// 随机播放函数
function getRandomIndex(playlist, currentIndex) {
  // 防止无限循环
  if (playlist.length === 1) {
    return currentIndex
  }
  // 将播放列表的长度做为随机的基地，从中随机一个整数
  let index = Math.round(Math.random() * (playlist.length - 1))
  // 如果随机的结果恰好等于当前播放歌曲，则重新随机一次
  if (index === currentIndex) {
    index = getRandomIndex(playlist, currentIndex)
  }
  // 返回随机后的索引
  return index
}
