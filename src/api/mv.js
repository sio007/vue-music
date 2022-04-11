import { request } from '@/utils'

// 获取相应id对应的mv
export const getMvDetail = id => request.get(`/mv/detail?mvid=${id}`)

// 获取所有mv
export const getAllMvs = (params) => request.get('/mv/all', { params })
