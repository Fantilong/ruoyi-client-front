<template>
  <!-- 终端主布局：顶部标题栏 + 内容区 -->
  <div class="terminal-layout">
    <!-- 顶部标题栏 -->
    <header class="terminal-header">
      <div class="header-inner">
        <div class="header-brand" @click="goHome">
          <el-icon class="brand-icon"><Reading /></el-icon>
          <span class="brand-text">图书借阅终端</span>
        </div>
        <div class="header-clock">
          <el-icon><Clock /></el-icon>
          <span>{{ currentTime }}</span>
        </div>
      </div>
    </header>

    <!-- 路由内容区 -->
    <main class="terminal-main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      // 当前时间字符串
      currentTime: '',
      // 定时器引用，组件销毁时需要清除
      timer: null
    }
  },
  created() {
    this.updateTime()
    // 每秒刷新一次时间，用于终端状态栏展示
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeUnmount() {
    // 组件卸载时清除定时器，避免内存泄漏
    clearInterval(this.timer)
  },
  methods: {
    /** 格式化并更新当前时间 */
    updateTime() {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const weekMap = ['日', '一', '二', '三', '四', '五', '六']
      this.currentTime =
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
        `星期${weekMap[now.getDay()]} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    },
    /** 点击标题返回图书浏览首页 */
    goHome() {
      if (this.$route.path !== '/book') {
        this.$router.push('/book')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.terminal-layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部标题栏：深蓝渐变，强化终端的秩序感 */
.terminal-header {
  height: $header-height;
  background: linear-gradient(90deg, $color-primary-dark 0%, $color-primary 55%, $color-primary-light 100%);
  color: $color-text-inverse;
  box-shadow: $shadow-base;
  position: sticky;
  top: 0;
  z-index: $z-header;
}

.header-inner {
  max-width: $content-max-width;
  height: 100%;
  margin: 0 auto;
  padding: 0 $spacing-lg;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-brand {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.brand-icon {
  font-size: 30px;
  margin-right: $spacing-base;
}

.brand-text {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  letter-spacing: 2px;
}

.header-clock {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-sm;
  opacity: 0.92;

  .el-icon {
    font-size: 18px;
  }
}

.terminal-main {
  flex: 1;
  width: 100%;
}
</style>
