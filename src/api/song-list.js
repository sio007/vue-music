import { request } from '@/utils'
// 获取歌单详情
export const getListDetail = params =>
  request.get('/playlist/detail', { params })

