import { request } from '@/utils'

// 获取相应id对应的mv详细页面
export const getMvDetail = id => request.get(`/mv/detail?mvid=${id}`)
