import request from '@/utils/request'
import type { HotSearchItem, SearchResponse } from '@/types/music'

export const searchService = {
  // 获取热搜榜
  getHotSearch: async () => {
    const { data } = await request.get('/search/hot/detail')
    if (data.code === 200) {
      return data.data.map((item: any) => ({
        id: item.searchWord,
        keyword: item.searchWord,
        hot: item.score > 500,
        description: item.content,
        score: item.score
      }))
    }
    throw new Error('获取热搜榜失败')
  },

  // 获取搜索建议
  getSearchSuggestions: async (keyword: string) => {
    const { data } = await request.get('/search/suggest', {
      params: { keywords: keyword }
    })
    if (data.code === 200) {
      return data.result.songs?.map((song: any) => song.name) || []
    }
    throw new Error('获取搜索建议失败')
  },

  // 搜索
  search: async (keywords: string, type: string = '1', offset: number = 0, limit: number = 30): Promise<SearchResponse> => {
    try {
      const { data } = await request.get('/search', {
        params: {
          keywords,
          type,
          offset,
          limit
        }
      })
      console.log('搜索结果:', data)
      return data
    } catch (error) {
      console.error('搜索请求失败:', error)
      throw error
    }
  }
} 