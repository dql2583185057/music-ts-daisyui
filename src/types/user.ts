export interface User {
  id: number
  username: string
  avatar?: string
}

export interface UserState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
} 