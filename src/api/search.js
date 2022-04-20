import { request } from '@/utils'

// 获取热搜列表
export const getSearchHot = () => request.get('/search/hot')

// 获取搜索建议
export const getSearchSuggest = (keywords) => request.get('/search/suggest', { params: { keywords } })

// 搜索
// 该接口分为三种搜索结果数据（歌曲，歌单，mv）
// 其中在参数param中设置type的值即可得到不同的结果
// 1.默认不传递type 显示歌曲
// 2.type=1000 显示歌单
// 3.type=1004 显示mv
export const getSearch = (params) => request.get('/search', { params })
