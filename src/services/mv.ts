import request from '@/utils/request'

export const mvService = {
  // 获取MV播放地址
  getMVUrl: (id: number) => {
    return request.get('/mv/url', { params: { id } })
  },

  // 获取MV详情
  getMVDetail: (id: number) => {
    return request.get('/mv/detail', { params: { mvid: id } })
  },

  // 获取相似MV
  getSimilarMV: (id: number) => {
    return request.get('/simi/mv', { params: { mvid: id } })
  },

  // 获取评论
  getComments: (id: number, offset = 0, limit = 20) => {
    return request.get('/comment/mv', {
      params: { id, offset, limit }
    })
  },

  // 发表评论
  comment: (id: number, content: string) => {
    return request.get('/comment', {
      params: {
        t: 1, // 1: 发送
        type: 1, // 1: MV
        id,
        content
      }
    })
  }
} 