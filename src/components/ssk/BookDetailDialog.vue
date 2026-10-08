<template>
  <!-- 书籍详情弹窗：左侧书籍信息 + 右侧图片轮播 -->
  <el-dialog
    v-model="visible"
    width="920px"
    :show-close="false"
    :close-on-click-modal="false"
    class="book-detail-dialog"
    destroy-on-close
    append-to-body
  >
    <!-- 自定义头部 -->
    <template #header>
      <div class="dialog-header">
        <div class="header-title">
          <span class="title-bar"></span>
          <span>书籍详情</span>
        </div>
        <el-icon class="close-btn" @click="visible = false"><Close /></el-icon>
      </div>
    </template>

    <!-- 加载骨架 -->
    <div v-if="loading" class="detail-body">
      <div class="info-side">
        <el-skeleton animated :rows="6" />
      </div>
      <div class="gallery-side">
        <el-skeleton-item variant="image" style="width: 100%; height: 100%; border-radius: 12px" />
      </div>
    </div>

    <!-- 详情内容 -->
    <div v-else-if="book" class="detail-body">
      <!-- 左侧：书籍信息 -->
      <div class="info-side">
        <h2 class="book-name">{{ book.name }}</h2>

        <div class="meta-list">
          <div class="meta-row">
            <span class="meta-label">作者</span>
            <span class="meta-value">{{ book.author }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">书架号</span>
            <el-tag size="large" effect="plain" round class="shelf-tag">{{ book.shelfCode }}</el-tag>
          </div>
          <div class="meta-row">
            <span class="meta-label">库存</span>
            <span class="meta-value" :class="book.stockQuantity > 0 ? 'stock-ok' : 'stock-empty'">
              {{ book.stockQuantity > 0 ? `剩余 ${book.stockQuantity} 本` : '暂无库存' }}
            </span>
          </div>
        </div>

        <div class="desc-block">
          <div class="desc-title">内容简介</div>
          <p class="desc-content">{{ book.description || '暂无简介' }}</p>
        </div>

        <!-- 申请借阅按钮 -->
        <el-button
          type="primary"
          size="large"
          class="borrow-btn"
          :disabled="book.stockQuantity <= 0"
          @click="handleBorrow"
        >
          <el-icon class="btn-icon"><Promotion /></el-icon>
          {{ book.stockQuantity > 0 ? '申请借阅' : '暂无库存，不可借阅' }}
        </el-button>
      </div>

      <!-- 右侧：图片轮播 -->
      <div class="gallery-side">
        <el-carousel
          v-if="imageList.length > 0"
          class="book-carousel"
          :interval="4000"
          arrow="hover"
          indicator-position="outside"
          height="100%"
        >
          <el-carousel-item v-for="(img, index) in imageList" :key="index">
            <div class="carousel-frame">
              <el-image :src="img" fit="contain" class="carousel-img" />
            </div>
          </el-carousel-item>
        </el-carousel>
        <!-- 无图占位 -->
        <div v-else class="carousel-empty">
          <el-icon><Picture /></el-icon>
          <span>暂无图片</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBook, createBorrowRequest } from '@/api/book'
import { resolveImageUrl } from '@/utils/url'

/**
 * 书籍详情弹窗组件
 * 通过ref调用open方法打开，左侧展示书籍信息，右侧图片轮播
 */
export default {
  name: 'BookDetailDialog',
  data() {
    return {
      // 弹窗可见性
      visible: false,
      // 加载状态
      loading: false,
      // 书籍详情
      book: null,
      // 提交借阅申请中
      submitting: false
    }
  },
  computed: {
    /** 图片集地址列表，无图片集时回退为封面 */
    imageList() {
      if (!this.book) return []
      if (this.book.images) {
        return this.book.images.split(',').filter(Boolean).map((u) => resolveImageUrl(u))
      }
      return this.book.cover ? [resolveImageUrl(this.book.cover)] : []
    }
  },
  methods: {
    /**
     * 打开弹窗并加载详情
     * @param {number} id 书籍ID
     */
    async open(id) {
      this.visible = true
      this.loading = true
      this.book = null
      try {
        // loading:false 关闭全屏loading，弹窗内自带骨架屏
        const res = await getBook(id, { loading: false })
        this.book = res.data
      } catch (e) {
        // 加载失败时关闭弹窗，错误提示由拦截器统一处理
        this.visible = false
      } finally {
        this.loading = false
      }
    },
    /** 申请借阅：二次确认后提交 */
    handleBorrow() {
      ElMessageBox.confirm(`确认借阅《${this.book.name}》书籍吗？`, '借阅确认', {
        confirmButtonText: '确认借阅',
        cancelButtonText: '再想想',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.submitting = true
          return createBorrowRequest({ bookId: this.book.id })
        })
        .then(() => {
          ElMessage.success('借阅申请已提交，请等待管理员审核')
          this.visible = false
        })
        .catch((err) => {
          // 用户取消时err为cancel/close字符串，静默处理
          if (err === 'cancel' || err === 'close') return
        })
        .finally(() => {
          this.submitting = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 弹窗整体圆角与阴影 */
:deep(.el-dialog) {
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(31, 58, 114, 0.22);
}

:deep(.el-dialog__header) {
  padding: $spacing-lg $spacing-xl 0;
  margin-right: 0;
}

:deep(.el-dialog__body) {
  padding: $spacing-lg $spacing-xl $spacing-xl;
}

/* 自定义头部 */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  letter-spacing: 2px;
}

/* 标题前装饰条 */
.title-bar {
  width: 5px;
  height: 22px;
  border-radius: $radius-pill;
  background: linear-gradient(180deg, $color-primary 0%, $color-primary-light 100%);
}

.close-btn {
  font-size: 22px;
  color: $color-text-secondary;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all $transition-fast;

  &:hover {
    color: $color-text-primary;
    background: $color-bg-muted;
    transform: rotate(90deg);
  }
}

/* 主体：左信息右图片 */
.detail-body {
  display: flex;
  gap: $spacing-xxl;
  min-height: 460px;
}

/* ---- 左侧信息区 ---- */
.info-side {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.book-name {
  margin: 0 0 $spacing-lg;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  line-height: 1.35;
  // 书名底部渐变下划线装饰
  background: linear-gradient(90deg, $color-primary-bg, transparent) bottom / 100% 10px no-repeat;
  padding-bottom: $spacing-sm;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding-bottom: $spacing-lg;
  border-bottom: 1px dashed $color-border;
  margin-bottom: $spacing-lg;
}

.meta-row {
  display: flex;
  align-items: center;
  font-size: $font-size-sm;
}

.meta-label {
  width: 64px;
  color: $color-text-secondary;
  flex-shrink: 0;
}

.meta-value {
  color: $color-text-primary;
  font-weight: $font-weight-medium;
}

.shelf-tag {
  font-weight: $font-weight-bold;
}

.stock-ok {
  color: $color-success;
}

.stock-empty {
  color: $color-danger;
}

/* 简介 */
.desc-block {
  flex: 1;
}

.desc-title {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $spacing-sm;

  &::before {
    content: '“';
    color: $color-primary-light;
    font-size: $font-size-lg;
    margin-right: 2px;
  }
}

.desc-content {
  margin: 0;
  color: $color-text-regular;
  font-size: $font-size-sm;
  line-height: 1.9;
  // 简介限高滚动，避免长文撑破弹窗
  max-height: 160px;
  overflow-y: auto;
}

/* 借阅按钮 */
.borrow-btn {
  margin-top: $spacing-lg;
  width: 100%;
  height: 56px;
  border-radius: $radius-pill;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  letter-spacing: 2px;
  background: linear-gradient(135deg, $color-primary-dark 0%, $color-primary 60%, $color-primary-light 100%);
  border: none;
  box-shadow: 0 8px 20px rgba(42, 82, 152, 0.35);
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover:not(.is-disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(42, 82, 152, 0.45);
  }
}

.btn-icon {
  margin-right: 8px;
  font-size: 20px;
}

/* ---- 右侧图片区 ---- */
.gallery-side {
  width: 340px;
  flex-shrink: 0;
  // 常规书籍比例约 3:4
  aspect-ratio: 3 / 4;
}

.book-carousel {
  height: 100%;
  width: 100%;

  :deep(.el-carousel__container) {
    height: calc(100% - 36px);
  }
}

/* 轮播帧：柔和背景承载，图片完整展示 */
.carousel-frame {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #f8fafc 0%, $color-primary-bg 100%);
  border-radius: $radius-base;
  overflow: hidden;
}

.carousel-img {
  max-width: 100%;
  max-height: 100%;
}

.carousel-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-base;
  color: $color-text-placeholder;
  background: $color-bg-muted;
  border-radius: $radius-base;
  font-size: $font-size-sm;

  .el-icon {
    font-size: 64px;
    opacity: 0.5;
  }
}
</style>
