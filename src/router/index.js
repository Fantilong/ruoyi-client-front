import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

// 路由表
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/book',
    children: [
      {
        // 图书浏览（首页）
        path: 'book',
        name: 'BookList',
        component: () => import('@/views/book/index.vue'),
        meta: { title: '图书浏览' }
      },
      {
        // 图书详情
        path: 'book/:id',
        name: 'BookDetail',
        component: () => import('@/views/book/detail.vue'),
        meta: { title: '图书详情' }
      }
    ]
  }
]

const router = createRouter({
  // history模式，使用HTML5 History API
  history: createWebHistory(),
  routes,
  // 切换路由时回到页面顶部
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
