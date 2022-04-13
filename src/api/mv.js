import { request } from '@/utils'

// 获取相应id对应的mv
export const getMvDetail = id => request.get(`/mv/detail?mvid=${id}`)
// 获取相应id对应的mv视频的播放路径
export const getMvUrl = id => request.get(`/mv/url?id=${id}`)


// 获取相应id对应的mv 的相似mv
export const getSimiMv = id => request.get(`/simi/mv?mvid=${id}`)

// 获取所有mv
export const getAllMvs = (params) => request.get('/mv/all', { params })
