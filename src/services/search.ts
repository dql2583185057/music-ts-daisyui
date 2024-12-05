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

  // 获取歌手详情
  getArtistDetail: async (id: number) => {
    try {
      const { data } = await request.get(`/artist/detail?id=${id}`)
      return data
    } catch (error) {
      console.error('获取歌手详情失败:', error)
      throw error
    }
  },

  // 搜索
  search: async (keywords: string, type: string = '1', offset: number = 0, limit: number = 30): Promise<SearchResponse> => {
    try {
      // 如果是综合搜索，需要同时获取多个类型的数据
      if (type === '1018') {
        const [artistRes, songsRes, albumsRes, playlistsRes, mvRes] = await Promise.all([
          request.get('/cloudsearch', { params: { keywords, type: '100', limit: 1 } }),
          request.get('/cloudsearch', { params: { keywords, type: '1', limit: 10 } }),
          request.get('/cloudsearch', { params: { keywords, type: '10', limit: 6 } }),
          request.get('/cloudsearch', { params: { keywords, type: '1000', limit: 6 } }),
          request.get('/cloudsearch', { params: { keywords, type: '1004', limit: 4 } })
        ])

        return {
          code: 200,
          result: {
            artist: artistRes.data.result.artists?.[0],
            songs: songsRes.data.result.songs || [],
            songCount: songsRes.data.result.songCount || 0,
            artists: artistRes.data.result.artists || [],
            artistCount: artistRes.data.result.artistCount || 0,
            albums: albumsRes.data.result.albums || [],
            albumCount: albumsRes.data.result.albumCount || 0,
            playlists: playlistsRes.data.result.playlists || [],
            playlistCount: playlistsRes.data.result.playlistCount || 0,
            mvs: mvRes.data.result.mvs || [],
            mvCount: mvRes.data.result.mvCount || 0
          }
        }
      }

      // 其他类型的搜索保持不变
      const { data } = await request.get('/cloudsearch', {
        params: {
          keywords,
          type,
          offset,
          limit
        }
      })
      return data
    } catch (error) {
      console.error('搜索失败:', error)
      throw error
    }
  }
} 