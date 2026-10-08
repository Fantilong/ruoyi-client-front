import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

// 创建axios实例
const service = axios.create({
  // 基础地址，开发环境走vite代理转发到ruoyi-client
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 请求超时时间（毫秒）
  timeout: 15000
})

// 全屏loading实例引用
let loadingInstance = null
// 待处理的请求计数，保证多个并发请求时loading只关闭一次
let loadingCount = 0

/**
 * 开启全屏loading
 */
function startLoading() {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(255, 255, 255, 0.65)'
    })
  }
  loadingCount++
}

/**
 * 关闭全屏loading
 */
function closeLoading() {
  loadingCount--
  if (loadingCount <= 0) {
    loadingCount = 0
    if (loadingInstance) {
      loadingInstance.close()
    }
  }
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // GET请求展示loading；POST等提交类请求由调用方自行控制，避免重复遮罩
    if (config.method === 'get' && config.loading !== false) {
      startLoading()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.config.method === 'get') {
      closeLoading()
    }
    const res = response.data
    // 后端统一返回结构：code=200表示成功
    if (res.code !== undefined && res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return res
  },
  (error) => {
    closeLoading()
    // 网络异常等统一提示
    const message = error.response && error.response.data && error.response.data.msg
      ? error.response.data.msg
      : '网络异常，请稍后重试'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service
