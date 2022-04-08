import { request } from '@/utils'

// 获取轮播图
export const getBanner = () => request.get('/banner?type=0')

// 获取推荐歌单
export const getPresonalized = params => request.get('/personalized', { params })

// 获取最新音乐
export const getNewSongs = () => request.get('/personalized/newsong')

// 获取推荐mv
export const getPersonalizedMv = () => request.get('/personalized/mv')
