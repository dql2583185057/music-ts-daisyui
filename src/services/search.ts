import request from '@/utils/request'
import type { SearchResponse } from '@/types/music'

export const searchService = {
  // 获取热搜榜
  getHotSearch: async () => {
    try {
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
    } catch (error) {
      console.error('获取热搜榜失败:', error)
      throw error
    }
  },

  // 获取搜索建议
  getSearchSuggestions: async (keywords: string) => {
    try {
      const { data } = await request.get('/search/suggest', {
        params: { keywords }
      })
      if (data.code === 200) {
        return data.result.songs?.map((song: any) => song.name) || []
      }
      throw new Error('获取搜索建议失败')
    } catch (error) {
      console.error('获取搜索建议失败:', error)
      throw error
    }
  },

  // 搜索
  search: async (keywords: string, type: string = '1', offset: number = 0, limit: number = 30): Promise<SearchResponse> => {
    try {
      const { data } = await request.get('/cloudsearch', {
        params: {
          keywords,
          type,
          offset,
          limit
        }
      })
      
      if (data.code === 200) {
        const result = data.result
        return {
          code: data.code,
          result: {
            songs: result.songs,
            songCount: result.songCount,
            artists: result.artists,
            artistCount: result.artistCount,
            albums: result.albums,
            albumCount: result.albumCount,
            playlists: result.playlists,
            playlistCount: result.playlistCount,
            mvs: result.mvs,
            mvCount: result.mvCount,
            videos: result.videos,
            videoCount: result.videoCount,
            userprofiles: result.userprofiles,
            userprofileCount: result.userprofileCount,
            djRadios: result.djRadios,
            djRadiosCount: result.djRadiosCount
          }
        }
      }
      throw new Error('搜索失败')
    } catch (error) {
      console.error('搜索失败:', error)
      throw error
    }
  }
} 