<template>
  <!-- 图书详情页：书籍信息展示 + 发起借阅申请 -->
  <div class="app-container detail-page" v-loading="loading">
    <template v-if="book">
      <!-- 返回按钮 -->
      <el-button plain size="large" class="back-btn" @click="goBack">
        <el-icon style="margin-right: 4px"><ArrowLeft /></el-icon>返回图书列表
      </el-button>

      <el-row :gutter="32" class="detail-card app-card">
        <!-- 左侧：封面与图片集 -->
        <el-col :span="9">
          <div class="cover-box">
            <el-image
              v-if="book.cover"
              :src="resolveImageUrl(book.cover)"
              fit="contain"
              class="main-cover"
              :preview-src-list="imageList"
              :initial-index="0"
              preview-teleported
            />
            <div v-else class="cover-empty">
              <el-icon><Picture /></el-icon>
              <span>暂无封面</span>
            </div>
          </div>
          <!-- 图片集缩略图 -->
          <div v-if="imageList.length > 1" class="thumb-list">
            <div
              v-for="(img, index) in imageList"
              :key="index"
              class="thumb-item"
              @click="previewIndex = index"
            >
              <el-image :src="img" fit="contain" :preview-src-list="imageList" :initial-index="index" preview-teleported />
            </div>
          </div>
        </el-col>

        <!-- 右侧：书籍信息 -->
        <el-col :span="15">
          <h1 class="book-title">{{ book.name }}</h1>

          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">作者</span>
              <span class="info-value">{{ book.author }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">书架号</span>
              <el-tag size="large" type="primary" effect="light">{{ book.shelfCode }}</el-tag>
            </div>
            <div class="info-row">
              <span class="info-label">库存</span>
              <span class="info-value" :class="book.stockQuantity > 0 ? 'stock-ok' : 'stock-empty'">
                {{ book.stockQuantity > 0 ? `剩余 ${book.stockQuantity} 本` : '暂无库存' }}
              </span>
            </div>
          </div>

          <div class="desc-block">
            <div class="desc-title">书籍简介</div>
            <p class="desc-content">{{ book.description || '暂无简介' }}</p>
          </div>

          <!-- 借阅操作 -->
          <div class="action-block">
            <el-button
              type="primary"
              size="large"
              class="borrow-btn"
              :disabled="book.stockQuantity <= 0"
              @click="handleApply"
            >
              <el-icon style="margin-right: 6px"><Promotion /></el-icon>
              {{ book.stockQuantity > 0 ? '申请借阅' : '暂无库存，不可借阅' }}
            </el-button>
            <span class="action-tip">提交申请后，请等待管理员审核，审核通过即完成借出</span>
          </div>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBook, createBorrowRequest } from '@/api/book'
import { resolveImageUrl } from '@/utils/url'

export default {
  name: 'BookDetail',
  data() {
    return {
      // 图书详情
      book: null,
      // 加载状态
      loading: false,
      // 当前预览图片下标
      previewIndex: 0
    }
  },
  computed: {
    /** 图片集地址列表（封面作为第一张） */
    imageList() {
      if (!this.book) return []
      const urls = []
      if (this.book.images) {
        this.book.images.split(',').filter(Boolean).forEach((u) => urls.push(this.resolveImageUrl(u)))
      } else if (this.book.cover) {
        urls.push(this.resolveImageUrl(this.book.cover))
      }
      return urls
    }
  },
  created() {
    this.fetchDetail()
  },
  methods: {
    /** 加载图书详情 */
    async fetchDetail() {
      this.loading = true
      try {
        const res = await getBook(this.$route.params.id)
        this.book = res.data
      } finally {
        this.loading = false
      }
    },
    /** 拼接图片完整访问地址 */
    resolveImageUrl,
    /** 返回上一页（列表页） */
    goBack() {
      this.$router.push('/book')
    },
    /** 发起借阅申请：弹窗填写囚号后提交 */
    handleApply() {
      ElMessageBox.prompt('请输入您的囚号，提交借阅申请', '申请借阅', {
        confirmButtonText: '确认申请',
        cancelButtonText: '取消',
        inputPattern: /^\S{1,50}$/,
        inputErrorMessage: '囚号不能为空，且长度不超过50个字符',
        inputPlaceholder: '请输入囚号'
      })
        .then(({ value }) => {
          // 提交借阅申请（状态默认为ready，由后台管理员审核）
          return createBorrowRequest({
            bookId: this.book.id,
            prisonerNumber: value.trim()
          })
        })
        .then(() => {
          ElMessage.success('借阅申请已提交，请等待管理员审核')
        })
        .catch((err) => {
          // 用户取消时err为cancel字符串，无需提示
          if (err === 'cancel' || err === 'close') return
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-page {
  padding-top: $spacing-lg;
  padding-bottom: $spacing-xxl;
}

.back-btn {
  margin-bottom: $spacing-lg;
}

.detail-card {
  padding: $spacing-xxl;
}

/* 封面区 */
.cover-box {
  width: 100%;
  height: 420px;
  border-radius: $radius-base;
  background: $color-bg-muted;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.main-cover {
  width: 100%;
  height: 100%;
  cursor: zoom-in;
}

.cover-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-base;
  color: $color-text-placeholder;

  .el-icon {
    font-size: 72px;
  }
}

/* 缩略图列表 */
.thumb-list {
  display: flex;
  gap: $spacing-base;
  margin-top: $spacing-md;
  flex-wrap: wrap;
}

.thumb-item {
  width: 72px;
  height: 72px;
  border-radius: $radius-sm;
  overflow: hidden;
  border: 2px solid $color-border-light;
  cursor: pointer;
  background: $color-bg-muted;
  transition: border-color $transition-fast;

  &:hover {
    border-color: $color-primary;
  }

  .el-image {
    width: 100%;
    height: 100%;
  }
}

/* 书名 */
.book-title {
  margin: 0 0 $spacing-lg;
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  line-height: 1.3;
}

/* 信息区 */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-lg 0;
  border-top: 1px solid $color-border-light;
  border-bottom: 1px solid $color-border-light;
  margin-bottom: $spacing-lg;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: $font-size-md;
}

.info-label {
  width: 90px;
  color: $color-text-secondary;
}

.info-value {
  color: $color-text-primary;
  font-weight: $font-weight-medium;
}

.stock-ok {
  color: $color-success;
}

.stock-empty {
  color: $color-danger;
}

/* 简介 */
.desc-block {
  margin-bottom: $spacing-xxl;
}

.desc-title {
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-base;
  color: $color-text-primary;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    background: $color-primary;
    border-radius: $radius-pill;
    margin-right: $spacing-sm;
    vertical-align: -2px;
  }
}

.desc-content {
  margin: 0;
  color: $color-text-regular;
  font-size: $font-size-sm;
  line-height: 1.9;
}

/* 操作区 */
.action-block {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.borrow-btn {
  min-width: 200px;
  height: 56px;
  font-size: $font-size-md;
  border-radius: $radius-base;
}

.action-tip {
  font-size: $font-size-xs;
  color: $color-text-secondary;
}
</style>
