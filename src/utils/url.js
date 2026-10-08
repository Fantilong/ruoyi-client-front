/**
 * 拼接资源完整访问地址
 * 后端返回的图片路径为相对路径（如/profile/xxx），需拼接接口基础前缀走代理
 * @param {string} url 后端返回的图片路径
 * @returns {string} 完整可访问地址
 */
export function resolveImageUrl(url) {
  if (!url) return ''
  // 已是完整地址时直接返回
  if (url.startsWith('http')) return url
  return import.meta.env.VITE_APP_BASE_API + url
}
