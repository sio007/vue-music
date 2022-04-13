import { request } from '@/utils'

// 获得歌手部分信息和热门歌曲
export const getArtists = id => request.get(`/artists?id=${id}`)

