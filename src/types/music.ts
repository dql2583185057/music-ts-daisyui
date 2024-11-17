export interface Song {
  id: number
  name: string
  ar: Array<{
    id: number
    name: string
  }>
  al: {
    id: number
    name: string
    picUrl: string
  }
  dt: number
  mv: number
  alia?: string[]
}

export interface Playlist {
  id: number
  name: string
  coverImgUrl?: string
  cover?: string
  songs?: Song[]
  trackCount?: number
  songCount?: number
  description?: string
  creator?: {
    id: number
    nickname: string
    avatarUrl: string
  }
}

export interface Artist {
  id: number
  name: string
  img1v1Url: string
  musicSize: number
}

export interface Album {
  id: number
  name: string
  picUrl: string
  artist: {
    id: number
    name: string
  }
}

export interface HotSearchItem {
  id: number | string
  keyword: string
  hot: boolean
  description?: string
  score: number
}

export interface MV {
  id: number
  name: string
  cover: string
  artistName: string
  duration: number
  playCount: number
}

export interface Video {
  id: number
  title: string
  coverUrl: string
  creator: {
    nickname: string
  }
  durationms: number
  playTime: number
}

export interface User {
  userId: number
  nickname: string
  avatarUrl: string
  signature?: string
}

export interface Radio {
  id: number
  name: string
  picUrl: string
  desc?: string
}

export interface SearchResult {
  songs?: Song[]
  songCount?: number
  artists?: Artist[]
  artistCount?: number
  albums?: Album[]
  albumCount?: number
  playlists?: Playlist[]
  playlistCount?: number
  mvs?: MV[]
  mvCount?: number
  videos?: Video[]
  videoCount?: number
  userprofiles?: User[]
  userprofileCount?: number
  djRadios?: Radio[]
  djRadiosCount?: number
  [key: string]: any
}

export interface SearchResponse {
  code: number
  result: {
    songs?: Song[]
    songCount?: number
    artists?: Artist[]
    artistCount?: number
    albums?: Album[]
    albumCount?: number
    playlists?: Playlist[]
    playlistCount?: number
    mvs?: MV[]
    mvCount?: number
    videos?: Video[]
    videoCount?: number
    userprofiles?: User[]
    userprofileCount?: number
    djRadios?: Radio[]
    djRadiosCount?: number
  }
}

export interface SearchSuggestion {
  keyword: string
  type: string
}

export type QRCodeStatus = 800 | 801 | 802 | 803 

export interface PlaylistSong extends Song {
  album: {
    id: number
    name: string
    picId: number
    picUrl: string
    artist: {
      id: number
      name: string
      picUrl: string | null
    }
  }
} 