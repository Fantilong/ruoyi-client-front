<template>
  <!-- 终端图书搜索区域组件 -->
  <div class="search-area">
    <div class="search-inner">
      <div class="search-brand">
        <el-icon class="search-icon"><Reading /></el-icon>
        <div class="search-text">
          <span class="search-title">图书借阅终端</span>
          <span class="search-subtitle">请在下方搜索您想借阅的书籍</span>
        </div>
      </div>
      <div class="search-box">
        <el-input
          v-model="keyword"
          class="search-input"
          size="large"
          placeholder="输入书籍名称，搜索感兴趣的好书..."
          clearable
          maxlength="50"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon class="input-icon"><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" size="large" class="search-btn" @click="handleSearch">
          <el-icon class="btn-icon"><Search /></el-icon>搜索
        </el-button>
      </div>
      <div v-if="currentCategoryName" class="search-tag">
        <span class="tag-label">当前类目</span>
        <el-tag size="large" type="primary" effect="dark" round>{{ currentCategoryName }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 搜索区域组件
 * 提供书籍名称搜索输入框、搜索按钮、当前类目标签展示
 */
export default {
  name: 'BookSearchArea',
  props: {
    // 当前选中的类目名称，用于在搜索栏下方展示
    currentCategoryName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 搜索关键字
      keyword: ''
    }
  },
  methods: {
    /** 触发搜索事件 */
    handleSearch() {
      this.$emit('search', this.keyword.trim())
    }
  }
}
</script>

<style lang="scss" scoped>
.search-area {
  background: linear-gradient(135deg, $color-primary-dark 0%, $color-primary 50%, $color-primary-light 100%);
  padding: $spacing-xl $spacing-lg;
  border-radius: 0 0 $radius-lg $radius-lg;
  box-shadow: $shadow-lg;
}

.search-inner {
  max-width: $content-max-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-lg;
}

/* 品牌提示区 */
.search-brand {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  color: #fff;
}

.search-icon {
  font-size: 48px;
  opacity: 0.9;
}

.search-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-title {
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  letter-spacing: 3px;
}

.search-subtitle {
  font-size: $font-size-sm;
  opacity: 0.82;
  letter-spacing: 1px;
}

/* 搜索框 */
.search-box {
  display: flex;
  width: 100%;
  max-width: 760px;
  gap: $spacing-base;
}

.search-input {
  flex: 1;

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.96);
    border-radius: $radius-pill;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 4px 20px;
    transition: box-shadow $transition-fast;

    &:hover,
    &.is-focus {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
    }
  }

  :deep(.el-input__inner) {
    height: 52px;
    font-size: $font-size-sm;
    color: $color-text-primary;

    &::placeholder {
      color: $color-text-placeholder;
    }
  }
}

.input-icon {
  font-size: 20px;
  color: $color-primary;
}

.search-btn {
  height: 60px;
  padding: 0 40px;
  border-radius: $radius-pill;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  border: none;
  color: $color-text-inverse;
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.4);
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 165, 0, 0.55);
  }
}

.btn-icon {
  margin-right: 6px;
  font-size: 20px;
}

/* 类目标签 */
.search-tag {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.tag-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: $font-size-xs;
}
</style>
