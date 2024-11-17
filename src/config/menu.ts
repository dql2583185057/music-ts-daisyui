import type { MenuItem, UserPlaylist } from '@/types/menu'
import type { Playlist } from '@/types/music'

export const mainMenuItems: MenuItem[] = [
  {
    id: 'discover',
    title: '发现音乐',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    path: '/'
  },
  {
    id: 'recommend',
    title: '个性推荐',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    path: '/recommend'
  },
  {
    id: 'playlist',
    title: '歌单',
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    path: '/playlist'
  },
  {
    id: 'ranking',
    title: '排行榜',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    path: '/ranking'
  },
  {
    id: 'artist',
    title: '歌手',
    icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z',
    path: '/artist'
  }
]

export const libraryMenuItems: MenuItem[] = [
  {
    id: 'local',
    title: '本地音乐',
    icon: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z',
    path: '/local'
  },
  {
    id: 'download',
    title: '下载管理',
    icon: 'M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
    path: '/download'
  },
  {
    id: 'recent',
    title: '最近播放',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    path: '/recent'
  },
  {
    id: 'cloud',
    title: '我的音乐云盘',
    icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    path: '/cloud'
  },
  {
    id: 'favorite',
    title: '我的收藏',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    path: '/favorite'
  }
]

export const defaultUserPlaylists: Playlist[] = [
  {
    id: 1,
    name: '我喜欢的音乐',
    cover: 'https://via.placeholder.com/100',
    coverImgUrl: 'https://via.placeholder.com/100',
    songs: [],
    songCount: 0,
    trackCount: 0,
    description: '我喜欢的音乐收藏'
  },
  {
    id: 2,
    name: '最近播放',
    cover: 'https://via.placeholder.com/100',
    coverImgUrl: 'https://via.placeholder.com/100',
    songs: [],
    songCount: 0,
    trackCount: 0,
    description: '最近播放的音乐'
  }
] 