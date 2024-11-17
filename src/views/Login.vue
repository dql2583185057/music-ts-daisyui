<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center mb-6">登录</h2>
        
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">用户名</span>
          </label>
          <input 
            type="text" 
            v-model="username"
            placeholder="请输入用户名" 
            class="input input-bordered w-full" 
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">密码</span>
          </label>
          <input 
            type="password"
            v-model="password" 
            placeholder="请输入密码" 
            class="input input-bordered w-full" 
          />
        </div>

        <div class="card-actions justify-end mt-6">
          <button 
            class="btn btn-primary w-full" 
            :class="{ loading: isLoading }"
            :disabled="isLoading"
            @click="handleLogin"
          >
            登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    return
  }

  isLoading.value = true
  try {
    // 这里应该调用实际的登录API
    // 模拟登录成功
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userStore.setLogin({
      user: {
        id: 1,
        username: username.value,
        avatar: 'https://via.placeholder.com/40'
      },
      token: 'mock_token'
    })

    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 