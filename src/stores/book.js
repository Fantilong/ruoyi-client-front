import { defineStore } from 'pinia'
import { listBook, listBookCategory } from '@/api/book'
import { handleTree } from '@/utils/tree'

/**
 * 图书Store
 * 统一管理类目树、图书列表及查询分页状态
 */
export const useBookStore = defineStore('book', {
  state: () => ({
    // 类目树数据
    categoryTree: [],
    // 当前选中的类目ID（0表示全部）
    currentCategoryId: 0,
    // 图书列表
    bookList: [],
    // 数据总条数
    total: 0,
    // 是否加载中
    loading: false,
    // 查询参数
    queryParams: {
      pageNum: 1,
      pageSize: 12,
      name: undefined,
      categoryIds: undefined
    }
  }),
  actions: {
    /**
     * 加载类目树
     */
    async fetchCategoryTree() {
      const res = await listBookCategory()
      // 后端返回平铺列表，前端构建为树
      this.categoryTree = handleTree(res.data || [])
    },

    /**
     * 加载图书列表
     */
    async fetchBookList() {
      this.loading = true
      try {
        // 类目ID为0（全部）时不传类目参数
        const params = { ...this.queryParams }
        if (!this.currentCategoryId || this.currentCategoryId === 0) {
          delete params.categoryIds
        } else {
          params.categoryIds = String(this.currentCategoryId)
        }
        const res = await listBook(params)
        this.bookList = res.rows || []
        this.total = res.total || 0
      } finally {
        this.loading = false
      }
    },

    /**
     * 切换类目并重新查询
     * @param {number|string} categoryId 类目ID
     */
    changeCategory(categoryId) {
      this.currentCategoryId = categoryId
      this.queryParams.pageNum = 1
      return this.fetchBookList()
    },

    /**
     * 搜索图书
     * @param {string} name 书籍名称关键字
     */
    search(name) {
      this.queryParams.name = name || undefined
      this.queryParams.pageNum = 1
      return this.fetchBookList()
    },

    /**
     * 翻页
     * @param {number} page 页码
     * @param {number} size 每页条数
     */
    changePage(page, size) {
      this.queryParams.pageNum = page
      this.queryParams.pageSize = size
      return this.fetchBookList()
    }
  }
})
