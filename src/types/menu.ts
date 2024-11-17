export interface MenuItem {
  id: string
  title: string
  icon: string
  path?: string
  children?: MenuItem[]
}

export interface UserPlaylist {
  id: number
  name: string
  cover?: string
} 