<template>
  <!-- 图书卡片组件 -->
  <div class="book-card" @click="handleClick">
    <!-- 封面区 -->
    <div class="card-cover">
      <el-image
        v-if="book.cover"
        :src="resolveImageUrl(book.cover)"
        fit="contain"
        class="cover-img"
        lazy
      >
        <template #error>
          <div class="cover-empty">
            <el-icon><Picture /></el-icon>
            <span>暂无封面</span>
          </div>
        </template>
      </el-image>
      <div v-else class="cover-empty">
        <el-icon><Picture /></el-icon>
        <span>暂无封面</span>
      </div>
      <!-- 库存角标 -->
      <div v-if="book.stockQuantity <= 0" class="badge badge-empty">暂无库存</div>
      <div v-else class="badge">在库 {{ book.stockQuantity }}</div>
    </div>
    <!-- 书籍信息 -->
    <div class="card-info">
      <div class="info-name">{{ book.name }}</div>
      <div class="info-meta">
        <span class="meta-author">
          <el-icon><User /></el-icon>{{ book.author }}
        </span>
        <span class="meta-shelf">
          <el-icon><CollectionTag /></el-icon>{{ book.shelfCode }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { resolveImageUrl } from '@/utils/url'

/**
 * 图书卡片组件
 * 纯展示组件，接收book对象，点击时触发事件
 */
export default {
  name: 'BookCard',
  props: {
    // 图书数据对象
    book: {
      type: Object,
      required: true
    }
  },
  methods: {
    /** 图片地址解析 */
    resolveImageUrl(url) {
      return resolveImageUrl(url)
    },
    /** 点击卡片 */
    handleClick() {
      this.$emit('click', this.book)
    }
  }
}
</script>

<style lang="scss" scoped>
.book-card {
  background: $color-bg-container;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: transform $transition-base, box-shadow $transition-base;

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-lg;

    .info-name {
      color: $color-primary;
    }
  }
}

/* 封面 */
.card-cover {
  position: relative;
  width: 100%;
  height: 260px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
}

.cover-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-base;
  color: $color-text-placeholder;
  font-size: $font-size-xs;

  .el-icon {
    font-size: 48px;
    opacity: 0.5;
  }
}

/* 角标 */
.badge {
  position: absolute;
  top: $spacing-base;
  right: $spacing-base;
  padding: 3px 12px;
  border-radius: $radius-pill;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  color: #fff;
  background: rgba(47, 158, 68, 0.92);

  &.badge-empty {
    background: rgba(100, 116, 139, 0.92);
  }
}

/* 信息区 */
.card-info {
  padding: $spacing-md;
}

.info-name {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  line-height: 1.5;
  height: 48px;
  margin-bottom: $spacing-sm;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.info-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $color-text-secondary;
  font-size: $font-size-xs;
}

.meta-author,
.meta-shelf {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  @include text-ellipsis;
}
</style>
