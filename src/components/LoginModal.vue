<template>
  <div class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box relative w-96 max-w-sm p-0 overflow-hidden">
      <!-- 关闭按钮 -->
      <button 
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
        @click="close"
      >✕</button>
      
      <!-- 标题 -->
      <div class="p-6 pb-0">
        <h3 class="font-bold text-lg text-center">
          登录<span class="text-primary">网易云音乐</span>
        </h3>
      </div>

      <!-- 登录方式切换 -->
      <div class="relative px-6 mt-6 mb-8">
        <div class="tabs w-full justify-center">
          <a 
            class="tab tab-bordered flex-1 transition-all duration-300"
            :class="{ 'tab-active': loginType === 'qrcode' }"
            @click="loginType = 'qrcode'"
          >
            扫码登录
          </a>
          <a 
            class="tab tab-bordered flex-1 transition-all duration-300"
            :class="{ 'tab-active': loginType === 'password' }"
            @click="loginType = 'password'"
          >
            密码登录
          </a>
        </div>
      </div>

      <div class="px-6 pb-6">
        <!-- 二维码登录 -->
        <div 
          v-if="loginType === 'qrcode'" 
          class="flex flex-col items-center"
          :class="{ 'animate-fade-in': loginType === 'qrcode' }"
        >
          <div 
            class="w-48 h-48 bg-base-200 rounded-xl flex items-center justify-center mb-4"
            v-if="!qrCode"
          >
            <div class="loading loading-spinner loading-lg text-primary"></div>
          </div>
          <div v-else class="relative group">
            <img 
              :src="qrCode" 
              alt="二维码" 
              class="w-48 h-48 rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            <div 
              v-if="qrCodeExpired"
              class="absolute inset-0 bg-base-200/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center transition-opacity duration-300"
            >
              <p class="text-sm mb-2 opacity-70">二维码已过期</p>
              <button class="btn btn-sm btn-primary" @click="refreshQRCode">
                点击刷新
              </button>
            </div>
          </div>
          <p class="text-sm mt-4 text-base-content/70">
            使用<span class="text-primary font-medium">网易云音乐APP</span>扫码登录
          </p>
        </div>

        <!-- 密码登录 -->
        <div 
          v-else 
          class="space-y-4"
          :class="{ 'animate-fade-in': loginType === 'password' }"
        >
          <div class="form-control">
            <label class="label">
              <span class="label-text">手机号</span>
            </label>
            <input 
              type="tel" 
              v-model="phone"
              placeholder="请输入手机号" 
              class="input input-bordered w-full focus:outline-none focus:border-primary transition-colors duration-300" 
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">密码</span>
            </label>
            <input 
              type="password"
              v-model="password" 
              placeholder="请输入密码" 
              class="input input-bordered w-full focus:outline-none focus:border-primary transition-colors duration-300" 
            />
          </div>

          <button 
            class="btn btn-primary w-full mt-6" 
            :class="{ loading: isLoading }"
            :disabled="isLoading || !phone || !password"
            @click="handlePasswordLogin"
          >
            登录
          </button>
        </div>
      </div>
    </div>
    <label class="modal-backdrop" @click="close">关闭</label>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import QRCode from 'qrcode'
import type { QRCodeStatus } from '@/types/music'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'login-success'): void
}>()

const userStore = useUserStore()
const loginType = ref<'qrcode' | 'password'>('qrcode')
const qrCode = ref<string>('')
const qrKey = ref<string>('')
const qrCodeExpired = ref(false)
const phone = ref('')
const password = ref('')
const isLoading = ref(false)
let checkQRCodeTimer: number

// 关闭模态框
const close = () => {
  emit('update:isOpen', false)
  resetForm()
}

// 重置表单
const resetForm = () => {
  loginType.value = 'qrcode'
  phone.value = ''
  password.value = ''
  qrCode.value = ''
  qrKey.value = ''
  qrCodeExpired.value = false
}

// 生成二维码
const generateQRCode = async (url: string) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000',
        light: '#fff'
      }
    })
    qrCode.value = qrDataUrl
  } catch (error) {
    console.error('生成二维码失败:', error)
  }
}

// 获取二维码
const getQRCode = async () => {
  try {
    isLoading.value = true
    // 这里应该调用实际的API获取二维码key
    // const res = await userApi.getQRKey()
    // qrKey.value = res.data.unikey
    
    // 模拟获取二维码key
    qrKey.value = 'mock_key_' + Date.now()
    
    // 生成二维码内容
    const qrUrl = `https://music.163.com/login?qrcode=${qrKey.value}`
    await generateQRCode(qrUrl)
    
    qrCodeExpired.value = false
    startCheckQRCode()
  } catch (error) {
    console.error('获取二维码失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 刷新二维码
const refreshQRCode = () => {
  getQRCode()
}

// 检查二维码状态
const checkQRCodeStatus = async () => {
  try {
    // 这里应该调用实际的API检查二维码状态
    // const res = await userApi.checkQRStatus(qrKey.value)
    // 模拟检查结果
    const mockStatus = Math.random() > 0.8 ? 800 : 801
    
    switch (mockStatus as QRCodeStatus) {
      case 800: // 二维码已扫描，等待确认
        break
      case 801: // 等待扫码
        break
      case 802: // 二维码已过期
        qrCodeExpired.value = true
        clearInterval(checkQRCodeTimer)
        break
      case 803: // 授权登录成功
        clearInterval(checkQRCodeTimer)
        // TODO: 调用实际的登录API
        userStore.setLogin({
          user: {
            id: 1,
            username: '网易云用户',
            avatar: 'https://via.placeholder.com/40'
          },
          token: 'mock_token'
        })
        emit('login-success')
        close()
        break
    }
  } catch (error) {
    console.error('检查二维码状态失败:', error)
  }
}

// 开始检查二维码状态
const startCheckQRCode = () => {
  if (checkQRCodeTimer) {
    clearInterval(checkQRCodeTimer)
  }
  // 每3秒检查一次状态
  checkQRCodeTimer = window.setInterval(checkQRCodeStatus, 3000)
  // 30秒后二维码过期
  setTimeout(() => {
    qrCodeExpired.value = true
    clearInterval(checkQRCodeTimer)
  }, 30000)
}

// 密码登录
const handlePasswordLogin = async () => {
  if (!phone.value || !password.value) return
  
  isLoading.value = true
  try {
    // 这里应该调用实际的登录API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userStore.setLogin({
      user: {
        id: 1,
        username: phone.value,
        avatar: 'https://via.placeholder.com/40'
      },
      token: 'mock_token'
    })

    emit('login-success')
    close()
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时获取二维码
onMounted(() => {
  if (props.isOpen && loginType.value === 'qrcode') {
    getQRCode()
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (checkQRCodeTimer) {
    clearInterval(checkQRCodeTimer)
  }
})

// 监听登录方式切换
watch(loginType, (newType) => {
  if (newType === 'qrcode' && props.isOpen) {
    getQRCode()
  }
})

// 监听模态框打开状态
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && loginType.value === 'qrcode') {
    getQRCode()
  } else if (!isOpen) {
    if (checkQRCodeTimer) {
      clearInterval(checkQRCodeTimer)
    }
    resetForm()
  }
})
</script>

<style scoped>
.modal-box {
  @apply p-0;
}

.tab-bordered {
  @apply border-b-2;
}

.tab-active {
  @apply border-primary text-primary;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* 输入框聚焦时的边框样式 */
.input:focus {
  border-width: 1px;
}

/* 标签页切换动画 */
.tab {
  position: relative;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.tab-active::after {
  background-color: currentColor;
}
</style> 