import { requestWithoutLoading } from '@/utils'



// 检查二维码状态
export const checkStatus = (key) => requestWithoutLoading.get(`/login/qr/check?key=${key}&timerstamp=${Date.now()}`, {
  withCredentials: true
})
// 检查登录状态
export const loginStatus = () => requestWithoutLoading.get(`/login/status?timerstamp=${Date.now()}`, {
  withCredentials: true
})
// 获得登录二维码key
export const getQRKey = () => requestWithoutLoading.get(`/login/qr/key?timerstamp=${Date.now()}`, {
  withCredentials: true
})
// 将获得的二维码key渲染为二维码图
export const getQR = (key) => requestWithoutLoading.get(`/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`, {
  withCredentials: true
})

// 获得用户信息
export const getUserDetail = (uid) => requestWithoutLoading.get('/user/detail', { params: { uid } })

const PLAYLIST_LIMIT = 1000
// 获得用户歌单信息
export const getUserPlaylist = (uid) => requestWithoutLoading.get('/user/playlist', { params: { uid, limit: PLAYLIST_LIMIT } })
