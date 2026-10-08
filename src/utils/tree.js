/**
 * 将平铺的类目列表构建为树结构
 * @param {Array} data 平铺数据
 * @param {string} id ID字段名
 * @param {string} parentId 父ID字段名
 * @param {string} children 子节点字段名
 * @param {number} rootId 根节点父ID
 * @returns {Array} 树结构数据
 */
export function handleTree(data, id = 'id', parentId = 'parentId', children = 'children', rootId = 0) {
  // 以ID为key建立映射，便于快速挂载
  const nodeMap = {}
  const result = []

  // 先克隆并初始化children
  data.forEach((item) => {
    nodeMap[item[id]] = { ...item, [children]: [] }
  })

  // 挂载到父节点，找不到父节点的归入根节点
  data.forEach((item) => {
    const node = nodeMap[item[id]]
    if (item[parentId] === rootId || !nodeMap[item[parentId]]) {
      result.push(node)
    } else {
      nodeMap[item[parentId]][children].push(node)
    }
  })

  // 清理空children，便于el-tree渲染
  const cleanEmpty = (nodes) => {
    nodes.forEach((n) => {
      if (n[children] && n[children].length > 0) {
        cleanEmpty(n[children])
      } else {
        delete n[children]
      }
    })
  }
  cleanEmpty(result)

  return result
}
