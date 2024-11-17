import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, UserState } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoggedIn = ref(false)

  // 从本地存储恢复状态
  const initState = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    }
  }

  // 设置登录状态
  const setLogin = (loginData: { user: User; token: string }) => {
    user.value = loginData.user
    token.value = loginData.token
    isLoggedIn.value = true
    localStorage.setItem('token', loginData.token)
    localStorage.setItem('user', JSON.stringify(loginData.user))
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    isLoggedIn.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    isLoggedIn,
    initState,
    setLogin,
    logout
  }
}) 