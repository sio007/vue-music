/**
 * 业务工具方法
 */

import { getAlbum, getMvDetail } from '@/api'
import router from '@/router'
import { isDef, notify } from './common'

// 创建歌曲 函数
export function createSong(song) {
  const { id, name, img, artists, duration, albumId, albumName, mvId, ...rest } = song

  return {
    id,
    name,
    img,
    artists,
    duration,
    albumName,
    url: genSongPlayUrl(song.id),
    artistsText: genArtistisText(artists),
    durationSecond: duration / 1000,
    // 专辑 如果需要额外请求封面的话必须加上
    albumId,
    // mv的id 如果有的话 会在songTable组件中加上mv链接。
    mvId,
    ...rest
  }
}

// 点击了mv，触发事件
// 有时候虽然有mvId 但是请求却404 所以跳转前先请求一把
export async function goMvWithCheck(id) {
  try {
    // 获取相应id的mv详细数据
    await getMvDetail(id)
    // 跳转到id相应mv详细链接的页面
    goMv(id)
  } catch (error) {
    notify('mv获取失败')
  }
}

// 跳转到id相应mv详细链接的页面
export function goMv(id) {
  router.push(`/mv/${id}`)
}

// 获取艺术家（歌手）数据
export function genArtistisText(artists) {
  return (artists || []).map(({ name }) => name).join('/')
}

// 获取 对应id 音乐 url
function genSongPlayUrl(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

// 获取歌曲的专辑封面
export async function getSongImg(id, albumId) {
  if (!isDef(albumId)) {
    throw new Error('need albumId')
  }
  const { songs } = await getAlbum(albumId)
  const {
    al: { picUrl }
  } = songs.find(({ id: songId }) => songId === id) || {}
  return picUrl
}
