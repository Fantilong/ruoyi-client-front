<template>
  <!-- 图书浏览页：左侧类目树 + 右侧图书卡片网格 -->
  <div class="app-container book-page">
    <el-row :gutter="20">
      <!-- 左侧类目面板 -->
      <el-col :span="5" class="category-col">
        <div class="category-panel app-card">
          <div class="panel-title">
            <el-icon><Files /></el-icon>
            <span>图书类目</span>
          </div>
          <el-tree
            ref="categoryTreeRef"
            :data="categoryTreeData"
              :props="{ label: 'title', children: 'children' }"
            node-key="id"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :highlight-current="true"
            :current-node-key="0"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="tree-label">
                <span>{{ data.id === 0 ? '全部图书' : node.label }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>

      <!-- 右侧图书区域 -->
      <el-col :span="19">
        <!-- 搜索栏 -->
        <div class="search-bar app-card">
          <el-input
            v-model="keyword"
            class="search-input"
            size="large"
            placeholder="请输入书籍名称搜索"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" size="large" @click="handleSearch">
            <el-icon style="margin-right: 4px"><Search /></el-icon>搜索
          </el-button>
        </div>

        <!-- 图书卡片网格 -->
        <div v-loading="store.loading" class="book-grid">
          <div
            v-for="book in store.bookList"
            :key="book.id"
            class="book-card app-card"
            @click="goDetail(book.id)"
          >
            <!-- 封面 -->
            <div class="book-cover">
              <el-image
                v-if="book.cover"
                :src="resolveImageUrl(book.cover)"
                fit="contain"
                class="cover-image"
              >
                <template #error>
                  <div class="cover-placeholder">
                    <el-icon><Picture /></el-icon>
                    <span>暂无封面</span>
                  </div>
                </template>
              </el-image>
              <div v-else class="cover-placeholder">
                <el-icon><Picture /></el-icon>
                <span>暂无封面</span>
              </div>
              <!-- 无库存角标 -->
              <div v-if="book.stockQuantity <= 0" class="stock-badge is-empty">暂无库存</div>
              <div v-else class="stock-badge">在库 {{ book.stockQuantity }}</div>
            </div>
            <!-- 书籍信息 -->
            <div class="book-info">
              <div class="book-name">{{ book.name }}</div>
              <div class="book-meta">
                <span class="meta-item">
                  <el-icon><User /></el-icon>{{ book.author }}
                </span>
                <span class="meta-item">
                  <el-icon><CollectionTag /></el-icon>{{ book.shelfCode }}
                </span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <el-empty v-if="!store.loading && store.bookList.length === 0" description="未找到相关图书" class="empty-tip" />
        </div>

        <!-- 分页 -->
        <div class="pagination-wrap" v-if="store.total > 0">
          <el-pagination
            background
            layout="prev, pager, next, total"
            :total="store.total"
            :default-page-size="store.queryParams.pageSize"
            :current-page="store.queryParams.pageNum"
            @current-change="handlePageChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useBookStore } from '@/stores/book'

export default {
  name: 'BookList',
  data() {
    return {
      // 图书Store实例
      store: useBookStore(),
      // 搜索关键字
      keyword: ''
    }
  },
  computed: {
    /** 类目树数据，顶部增加“全部图书”根节点 */
    categoryTreeData() {
      return [{ id: 0, title: '全部图书', children: this.store.categoryTree }]
    }
  },
  created() {
    // 初始化加载类目树与图书列表
    this.store.fetchCategoryTree()
    this.store.fetchBookList()
  },
  methods: {
    /** 拼接图片完整访问地址（复用开发代理前缀） */
    resolveImageUrl(url) {
      if (!url) return ''
      if (url.startsWith('http')) return url
      return import.meta.env.VITE_APP_BASE_API + url
    },
    /** 点击类目节点筛选图书 */
    handleNodeClick(data) {
      this.store.changeCategory(data.id)
    },
    /** 搜索按钮 */
    handleSearch() {
      this.store.search(this.keyword)
    },
    /** 翻页 */
    handlePageChange(page) {
      this.store.changePage(page, this.store.queryParams.pageSize)
    },
    /** 跳转图书详情 */
    goDetail(id) {
      this.$router.push('/book/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
.book-page {
  padding-top: $spacing-lg;
  padding-bottom: $spacing-xxl;
}

/* 左侧类目面板 */
.category-panel {
  position: sticky;
  top: calc($header-height + $spacing-lg);
  padding: $spacing-md;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  padding: $spacing-sm $spacing-sm $spacing-md;
  border-bottom: 2px solid $color-primary-bg;
  margin-bottom: $spacing-base;
}

.tree-label {
  font-size: $font-size-sm;
  padding: $spacing-xs 0;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  margin-bottom: $spacing-lg;
}

.search-input {
  flex: 1;
}

/* 图书网格 */
.book-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  min-height: 200px;
}

/* 图书卡片 */
.book-card {
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  transition: transform $transition-base, box-shadow $transition-base;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;

    .book-name {
      color: $color-primary;
    }
  }
}

.book-cover {
  position: relative;
  width: 100%;
  height: 220px;
  background: $color-bg-muted;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  color: $color-text-placeholder;
  font-size: $font-size-xs;

  .el-icon {
    font-size: 42px;
  }
}

/* 库存角标 */
.stock-badge {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  padding: 2px $spacing-base;
  border-radius: $radius-pill;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  color: #fff;
  background: rgba(47, 158, 68, 0.92);

  &.is-empty {
    background: rgba(100, 116, 139, 0.92);
  }
}

.book-info {
  padding: $spacing-md;
}

.book-name {
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  line-height: 1.4;
  height: 50px;
  margin-bottom: $spacing-sm;
  @include text-ellipsis-multi(2);
}

.book-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $color-text-secondary;
  font-size: $font-size-xs;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  @include text-ellipsis;
}

.empty-tip {
  grid-column: 1 / -1;
}

/* 分页 */
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: $spacing-xl;
}

/* 中等屏幕每行3本 */
@media (max-width: 1200px) {
  .book-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
