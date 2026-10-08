<template>
  <!-- 终端图书类目树组件 -->
  <div class="category-tree app-card">
    <div class="tree-header">
      <el-icon class="header-icon"><Collection /></el-icon>
      <span class="header-title">图书类目</span>
    </div>
    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="{ label: 'title', children: 'children' }"
      node-key="id"
      :default-expand-all="true"
      :expand-on-click-node="false"
      :highlight-current="true"
      :indent="22"
      @node-click="handleNodeClick"
    >
      <template #default="{ node, data }">
        <!-- 节点内容：图标 + 标题 -->
        <span class="tree-node" :class="{ 'is-root': data.id === 0 }">
          <el-icon v-if="data.id === 0" class="node-icon root-icon"><Grid /></el-icon>
          <el-icon v-else class="node-icon"><Folder /></el-icon>
          <span class="node-label">{{ data.id === 0 ? '全部' : node.label }}</span>
          <span v-if="data.count !== undefined && data.id !== 0" class="node-count">{{ data.count }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
/**
 * 图书类目树组件
 * 展示图书分类树结构，支持点击选中，精美高亮选中效果
 */
export default {
  name: 'BookCategoryTree',
  props: {
    // 类目树数据（含根节点）
    treeData: {
      type: Array,
      default: () => []
    },
    // 当前选中的类目ID
    currentId: {
      type: [Number, String],
      default: 0
    }
  },
  watch: {
    // 监听树数据变化，同步高亮当前选中项
    treeData() {
      this.$nextTick(() => {
        this.$refs.treeRef?.setCurrentKey(this.currentId)
      })
    }
  },
  methods: {
    /** 节点点击 */
    handleNodeClick(data) {
      this.$emit('select', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.category-tree {
  padding: $spacing-md;
  height: fit-content;
  position: sticky;
  top: calc($header-height + $spacing-lg + $spacing-xl * 2);
}

/* 头部 */
.tree-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-base $spacing-md;
  border-bottom: 2px solid $color-primary-bg;
  margin-bottom: $spacing-base;
}

.header-icon {
  font-size: 22px;
  color: $color-primary;
}

.header-title {
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  letter-spacing: 1px;
}

/* 树节点自定义样式 */
:deep(.el-tree) {
  background: transparent;
  font-size: $font-size-sm;

  /* 节点内容行 */
  .el-tree-node__content {
    height: 48px;
    padding: 0 $spacing-base !important;
    border-radius: $radius-base;
    margin: 2px 0;
    transition: background $transition-fast;

    /* 悬浮效果 */
    &:hover {
      background: $color-primary-bg;
    }
  }

  /* 当前选中节点 - 精美渐变高亮 */
  .el-tree-node.is-current > .el-tree-node__content {
    background: linear-gradient(90deg, $color-primary-dark 0%, $color-primary 60%, $color-primary-light 100%);
    box-shadow: 0 4px 12px rgba(42, 82, 152, 0.35);
    border-radius: $radius-base;

    /* 选中后图标和文字都变白 */
    .tree-node {
      .node-icon {
        color: rgba(255, 255, 255, 0.92);
      }

      .node-label {
        color: #fff;
        font-weight: $font-weight-bold;
      }

      .node-count {
        background: rgba(255, 255, 255, 0.22);
        color: #fff;
      }
    }
  }

  /* 展开箭头图标 */
  .el-tree-node__expand-icon {
    font-size: 16px;
    color: $color-text-secondary;

    &.is-leaf {
      visibility: hidden;
    }
  }

  /* 子级缩进线 */
  .el-tree-node__children {
    position: relative;
  }
}

/* 节点内容结构 */
.tree-node {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex: 1;
  min-width: 0;
  padding: $spacing-xs 0;

  &.is-root .node-label {
    font-weight: $font-weight-bold;
    font-size: $font-size-base;
  }
}

.node-icon {
  font-size: 18px;
  color: $color-primary;
  flex-shrink: 0;

  &.root-icon {
    color: $color-warning;
  }
}

.node-label {
  flex: 1;
  min-width: 0;
  @include text-ellipsis;
  color: $color-text-regular;
  font-size: $font-size-sm;
  line-height: 1.4;
}

/* 数量标签 */
.node-count {
  flex-shrink: 0;
  background: $color-bg-muted;
  color: $color-text-secondary;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  padding: 1px 8px;
  border-radius: $radius-pill;
  margin-left: $spacing-sm;
}
</style>
