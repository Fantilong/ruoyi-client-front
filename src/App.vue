<template>
  <!-- 终端应用根组件 -->
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
// 根组件仅承载路由视图与页面切换过渡
export default {
  name: 'App'
}
</script>
