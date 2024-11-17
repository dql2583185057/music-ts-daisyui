import request from '@/utils/request'
import type { User } from '@/types/user'
import type { Song, Playlist } from '@/types/music'

// 用户相关接口
export const userApi = {
  // 登录
  login: (data: { username: string; password: string }) => 
    request.post<{ token: string; user: User }>('/auth/login', data),

  // 获取用户信息
  getUserInfo: () => 
    request.get<User>('/user/info'),

  // 更新用户信息
  updateUserInfo: (data: Partial<User>) => 
    request.put<User>('/user/info', data)
}

// 音乐相关接口
export interface HotSearchItem {
  id: number
  keyword: string
  hot: boolean
  description?: string
  score: number
}

export const musicApi = {
  // 获取推荐歌单
  getRecommendPlaylists: () => 
    request.get<Playlist[]>('/playlists/recommend'),

  // 获取歌单详情
  getPlaylistDetail: (id: number) => 
    request.get<Playlist>(`/playlists/${id}`),

  // 搜索音乐
  searchMusic: (keyword: string) => 
    request.get<Song[]>(`/search?keyword=${keyword}`),

  // 获取音乐详情
  getSongDetail: (id: number) => 
    request.get<Song>(`/songs/${id}`),

  // 获取用户歌单
  getUserPlaylists: () => 
    request.get<Playlist[]>('/user/playlists'),

  // 创建歌单
  createPlaylist: (data: { name: string; description?: string }) => 
    request.post<Playlist>('/playlists', data),

  // 删除歌单
  deletePlaylist: (id: number) => 
    request.delete(`/playlists/${id}`),

  // 添加歌曲到歌单
  addToPlaylist: (playlistId: number, songId: number) => 
    request.post(`/playlists/${playlistId}/songs/${songId}`),

  // 从歌单移除歌曲
  removeFromPlaylist: (playlistId: number, songId: number) => 
    request.delete(`/playlists/${playlistId}/songs/${songId}`),

  // 获取热搜列表
  getHotSearch: () => 
    request.get<HotSearchItem[]>('/search/hot/detail'),

  // 获取搜索建议
  getSearchSuggestions: (keyword: string) => 
    request.get<string[]>(`/search/suggest?keywords=${keyword}`)
} 