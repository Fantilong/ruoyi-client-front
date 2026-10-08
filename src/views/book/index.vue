<template>
  <!-- 终端首页：顶部搜索 + 左侧类目树 + 右侧图书列表（无限滚动） -->
  <div class="home-page">
    <!-- 顶部搜索区域 -->
    <book-search-area
      :current-category-name="currentCategoryName"
      @search="handleSearch"
    />

    <!-- 主体区域 -->
    <div class="home-body app-container">
      <!-- 左侧类目树 -->
      <aside class="home-aside">
        <book-category-tree
          :tree-data="categoryTreeData"
          :current-id="currentCategoryId"
          @select="handleCategorySelect"
        />
      </aside>

      <!-- 右侧图书列表 -->
      <section class="home-content">
        <book-list-panel
          :book-list="bookList"
          :first-loading="firstLoading"
          :loading-more="loadingMore"
          :no-more="noMore"
          @load-more="loadMore"
          @click-book="openDetail"
        />
      </section>
    </div>

    <!-- 书籍详情弹窗 -->
    <book-detail-dialog ref="detailDialog" />
  </div>
</template>

<script>
import { listBook, listBookCategory } from '@/api/book'
import { handleTree } from '@/utils/tree'
import BookSearchArea from '@/components/ssk/BookSearchArea.vue'
import BookCategoryTree from '@/components/ssk/BookCategoryTree.vue'
import BookListPanel from '@/components/ssk/BookListPanel.vue'
import BookDetailDialog from '@/components/ssk/BookDetailDialog.vue'

/** 每页展示9本书（每行3本，共3行） */
const PAGE_SIZE = 9

export default {
  name: 'BookHome',
  components: {
    BookSearchArea,
    BookCategoryTree,
    BookListPanel,
    BookDetailDialog
  },
  data() {
    return {
      // 类目树数据（不含“全部”根节点）
      categoryTree: [],
      // 当前选中的类目ID，0表示全部
      currentCategoryId: 0,
      // 当前选中的类目名称（用于搜索区域展示）
      currentCategoryName: '',
      // 搜索关键字
      keyword: '',
      // 图书列表
      bookList: [],
      // 数据总条数
      total: 0,
      // 当前页码
      pageNum: 1,
      // 首页加载中（展示骨架屏）
      firstLoading: false,
      // 加载更多中
      loadingMore: false
    }
  },
  computed: {
    /** 类目树数据，顶部插入“全部”根节点 */
    categoryTreeData() {
      return [{ id: 0, title: '全部', children: this.categoryTree }]
    },
    /** 是否已加载全部数据 */
    noMore() {
      return this.total > 0 && this.bookList.length >= this.total
    }
  },
  created() {
    this.fetchCategories()
    this.resetAndLoad()
  },
  methods: {
    /** 加载类目树 */
    async fetchCategories() {
      try {
        const res = await listBookCategory()
        // 后端返回平铺列表，前端构建为树
        this.categoryTree = handleTree(res.data || [])
      } catch (e) {
        // 错误提示已由request拦截器统一处理
      }
    },
    /**
     * 加载图书列表
     * @param {boolean} append true-追加（加载更多），false-替换（首页加载）
     */
    async fetchBooks(append) {
      // 类目ID为0（全部）时不传类目参数，搜索时携带当前选中类目
      const params = {
        pageNum: this.pageNum,
        pageSize: PAGE_SIZE,
        name: this.keyword || undefined,
        categoryIds: this.currentCategoryId ? String(this.currentCategoryId) : undefined
      }
      const res = await listBook(params)
      const rows = res.rows || []
      this.bookList = append ? this.bookList.concat(rows) : rows
      this.total = res.total || 0
    },
    /** 重置并加载第一页（切换类目/搜索时调用） */
    async resetAndLoad() {
      this.pageNum = 1
      this.bookList = []
      this.total = 0
      this.firstLoading = true
      try {
        await this.fetchBooks(false)
      } finally {
        this.firstLoading = false
      }
    },
    /** 滚动触底加载下一页 */
    async loadMore() {
      if (this.loadingMore || this.noMore) return
      this.pageNum += 1
      this.loadingMore = true
      try {
        await this.fetchBooks(true)
      } finally {
        this.loadingMore = false
      }
    },
    /** 搜索（按当前选中类目过滤） */
    handleSearch(keyword) {
      this.keyword = keyword
      this.resetAndLoad()
    },
    /** 选中类目 */
    handleCategorySelect(node) {
      if (node.id === this.currentCategoryId) return
      this.currentCategoryId = node.id
      // “全部”根节点不展示类目标签
      this.currentCategoryName = node.id === 0 ? '' : node.title
      this.resetAndLoad()
    },
    /** 打开书籍详情弹窗 */
    openDetail(book) {
      this.$refs.detailDialog.open(book.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100%;
}

/* 主体区域：左侧固定类目栏 + 右侧自适应图书列表 */
.home-body {
  display: flex;
  gap: $spacing-lg;
  padding-top: $spacing-lg;
  padding-bottom: $spacing-xxl;
  align-items: flex-start;
}

.home-aside {
  width: 260px;
  flex-shrink: 0;
}

.home-content {
  flex: 1;
  min-width: 0;
}
</style>
