import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite配置：终端前端，开发时代理到ruoyi-client（默认8081端口）
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 8091,
      host: true,
      open: true,
      proxy: {
        // 接口请求代理到终端后端服务
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_TARGET || 'http://localhost:8081',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 全局注入变量文件，所有组件可直接使用theme.scss中的SCSS变量与mixin
          additionalData: `@use "@/styles/theme.scss" as *;`
        }
      }
    }
  }
})
