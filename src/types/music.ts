export interface Song {
  id: number
  name: string
  duration: number
  artists: Array<{
    id: number
    name: string
  }>
  album: {
    id: number
    name: string
    picUrl: string
  }
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

export interface SearchResponse {
  code: number
  result: {
    songs?: Song[]
    songCount?: number
    playlists?: Playlist[]
    playlistCount?: number
    artists?: Artist[]
    artistCount?: number
    albums?: Album[]
    albumCount?: number
  }
}

export interface SearchSuggestion {
  keyword: string
  type: string
}

export type QRCodeStatus = 800 | 801 | 802 | 803 