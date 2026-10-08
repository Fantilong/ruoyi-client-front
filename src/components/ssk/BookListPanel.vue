<template>
  <!-- 图书列表面板组件（含无限滚动 + 触底加载 + 分页兜底） -->
  <div class="list-panel">
    <!-- 加载骨架屏：第一页加载时展示 -->
    <div v-if="firstLoading" class="book-grid">
      <el-skeleton
        v-for="i in 9"
        :key="i"
        animated
        class="skeleton-card"
      >
        <template #template>
          <el-skeleton-item variant="image" style="height: 260px; border-radius: 10px" />
          <div style="padding: 16px">
            <el-skeleton-item variant="h3" style="width: 70%" />
            <el-skeleton-item variant="text" style="margin-top: 10px; width: 45%" />
          </div>
        </template>
      </el-skeleton>
    </div>

    <!-- 图书网格 -->
    <div v-else-if="bookList.length > 0" v-infinite-scroll="handleLoadMore" :infinite-scroll-distance="120" :infinite-scroll-disabled="loadingMore || noMore" class="book-grid">
      <BookCard
        v-for="book in bookList"
        :key="book.id"
        :book="book"
        @click="handleCardClick(book)"
      />
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="未找到相关图书" class="empty-tip" />

    <!-- 加载更多提示 -->
    <div v-if="!firstLoading && bookList.length > 0" class="load-status">
      <div v-if="loadingMore" class="status-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>正在加载更多...</span>
      </div>
      <div v-else-if="noMore" class="status-done">
        <span>— 已加载全部图书 —</span>
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from './BookCard.vue'

/**
 * 图书列表面板组件
 * 支持无限滚动触底加载、骨架屏首屏加载效果
 * 页面尺寸计算：每行3本，每页9本，填满至少3行
 */
export default {
  name: 'BookListPanel',
  components: { BookCard },
  props: {
    // 图书数据列表
    bookList: {
      type: Array,
      default: () => []
    },
    // 是否正在加载第一页数据（用于骨架屏）
    firstLoading: {
      type: Boolean,
      default: false
    },
    // 是否正在加载更多数据
    loadingMore: {
      type: Boolean,
      default: false
    },
    // 是否已加载完毕
    noMore: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /** 滚动触底，触发加载下一页 */
    handleLoadMore() {
      if (this.noMore || this.loadingMore) return
      this.$emit('load-more')
    },
    /** 点击图书卡片 */
    handleCardClick(book) {
      this.$emit('click-book', book)
    }
  }
}
</script>

<style lang="scss" scoped>
.list-panel {
  min-height: 200px;
}

/* 网格：每行3本，9本填满3行 */
.book-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
}

/* 骨架屏卡片 */
.skeleton-card {
  background: $color-bg-container;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

/* 空状态 */
.empty-tip {
  grid-column: 1 / -1;
  padding: $spacing-xxl 0;
}

/* 加载状态 */
.load-status {
  display: flex;
  justify-content: center;
  padding: $spacing-xl 0;
}

.status-loading {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $color-text-secondary;
  font-size: $font-size-sm;

  .el-icon {
    font-size: 18px;
  }
}

.status-done {
  color: $color-text-placeholder;
  font-size: $font-size-xs;
  letter-spacing: 1px;
}
</style>
