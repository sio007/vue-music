/**
 * 业务工具方法
 */

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

// 获取艺术家（歌手）数据
export function genArtistisText(artists) {
  return (artists || []).map(({ name }) => name).join('/')
}

// 获取 对应id 音乐 url
function genSongPlayUrl(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}
