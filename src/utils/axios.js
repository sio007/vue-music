import axios from 'axios'
import { Loading } from 'element-ui'
import { confirm } from '@/base/confirm'
import store from '@/store'

// 设置axios请求的基准地址
const BASE_URL = 'http://localhost:3000/'

// 不带全局loading的axios请求实例
export const requestWithoutLoading = createBaseInstance()

// 带全局loading的axios请求实例
// 传入函数是因为需要在处理请求结果handleResponse之前处理loading
// 所以要在内部插入loading拦截器的处理逻辑
export const request = createBaseInstance()
mixinLoading(request.interceptors)

// 通用的axios实例
function createBaseInstance () {
  const instance = axios.create({
    baseURL: BASE_URL
  })

  // 响应拦截器
  instance.interceptors.response.use(handleResponse, handleError)

  // 返回axios实例
  return instance
}

// 服务器响应失败时 返回的错误信息
function handleError (e) {
  confirm(e.message, '出错啦')
}
// 服务器响应成功时 返回的数据
function handleResponse (response) {
  return response.data
}

// 定义请求进度条变量
let loading
let loadingCount = 0
// 导入VUEX中global模块
const SET_AXIOS_LOADING = 'global/setAxiosLoading'

// 带loading拦截器
function mixinLoading(interceptors) {
  // 带loading的请求拦截器
  interceptors.request.use(loadingRequestInterceptor)
  // 带loading的响应拦截器
  interceptors.response.use(loadingResponseInterceptor, loadingResponseErrorInterceptor)

  // 带loading的请求拦截器函数
  function loadingRequestInterceptor(config) {
    if (!loading) {
      loading = Loading.service({
        target: 'body',
        background: 'transparent',
        text: '载入中'
      })
      store.commit(SET_AXIOS_LOADING, true)
    }
    loadingCount++

    return config
  }

  // 带loading的响应拦截器 loading函数
  function handleResponseLoading() {
    loadingCount--
    if (loadingCount === 0) {
      loading.close()
      loading = null
      store.commit(SET_AXIOS_LOADING, false)
    }
  }

  // 带loading的响应拦截器 成功时返回的数据 函数
  function loadingResponseInterceptor(response) {
    handleResponseLoading()
    return response
  }
  // 带loading的响应拦截器 失败时返回的错误信息 函数
  function loadingResponseErrorInterceptor(e) {
    handleResponseLoading()
    throw e
  }
}
