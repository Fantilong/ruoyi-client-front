import request from '@/utils/request'

// 分页查询图书列表（支持书籍名称、类目ID筛选）
export function listBook(query) {
  return request({
    url: '/client/book/list',
    method: 'get',
    params: query
  })
}

// 查询图书详情
export function getBook(id) {
  return request({
    url: '/client/book/' + id,
    method: 'get'
  })
}

// 查询全部图书类目（平铺列表）
export function listBookCategory() {
  return request({
    url: '/client/book/category/list',
    method: 'get'
  })
}

// 发起借阅申请（终端场景无需登录，囚号由使用人填写）
export function createBorrowRequest(data) {
  return request({
    url: '/client/borrowRequest',
    method: 'post',
    data: data
  })
}
