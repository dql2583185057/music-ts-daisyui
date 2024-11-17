<template>
  <div class="h-full w-64 bg-base-200 flex flex-col">
    <!-- Logo区域 -->
    <div class="p-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <span class="text-lg font-bold">音乐网站</span>
      </div>
    </div>

    <!-- 主导航 -->
    <div class="p-4 flex-1 overflow-y-auto hover-scrollbar text-sm">
      <!-- 在线音乐 -->
      <div class="space-y-1">
        <h3 class="font-bold px-3 mb-2 text-xs text-base-content/70 uppercase tracking-wider">在线音乐</h3>
        <router-link 
          v-for="item in mainMenuItems"
          :key="item.id"
          :to="item.path || ''"
          class="flex items-center gap-3 p-2 rounded-xl transition-colors"
          :class="{ 
            'bg-primary text-primary-content': isRouteMatch(item.path || ''),
            'hover:bg-base-300': !isRouteMatch(item.path || '')
          }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span>{{ item.title }}</span>
        </router-link>
      </div>

      <!-- 我的音乐 -->
      <div class="mt-6 space-y-1 pt-6 border-t border-base-300">
        <h3 class="font-bold px-3 mb-2 text-xs text-base-content/70 uppercase tracking-wider">我的音乐</h3>
        <router-link 
          v-for="item in libraryMenuItems"
          :key="item.id"
          :to="item.path || ''"
          class="flex items-center gap-3 p-2 rounded-xl transition-colors"
          :class="{ 
            'bg-primary text-primary-content': isRouteMatch(item.path || ''),
            'hover:bg-base-300': !isRouteMatch(item.path || '')
          }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span>{{ item.title }}</span>
        </router-link>
      </div>

      <!-- 创建的歌单 - 未登录时显示登录提示 -->
      <div v-if="!isLoggedIn" class="mt-6 pt-6 border-t border-base-300 mb-20">
        <div class="px-3 py-8 text-center">
          <p class="text-base-content/70 mb-4">登录后查看创建的歌单</p>
          <button class="btn btn-primary btn-sm" @click="handleLoginClick">
            立即登录
          </button>
        </div>
      </div>

      <!-- 创建的歌单 - 登录后显示 -->
      <div v-else class="mt-6 pt-6 border-t border-base-300 mb-20">
        <h3 class="font-bold px-3 mb-2 text-xs text-base-content/70 uppercase tracking-wider">创建的歌单</h3>
        <div class="space-y-1">
          <router-link 
            v-for="playlist in userPlaylists" 
            :key="playlist.id" 
            :to="`/playlist/${playlist.id}`"
            class="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors"
            :class="{
              'bg-primary text-primary-content': isRouteMatch(`/playlist/${playlist.id}`),
              'hover:bg-base-300': !isRouteMatch(`/playlist/${playlist.id}`)
            }"
          >
            <div class="w-6 h-6 rounded-lg bg-base-300 flex items-center justify-center flex-shrink-0">
              <img 
                v-if="playlist.cover" 
                :src="playlist.cover" 
                :alt="playlist.name"
                class="w-full h-full object-cover rounded-lg"
              />
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span class="truncate text-sm">{{ playlist.name }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 创建歌单按钮 - 仅登录后显示 -->
    <div v-if="isLoggedIn" class="p-4 border-t border-base-300 absolute bottom-0 left-0 right-0 bg-base-200">
      <button class="btn btn-primary btn-sm w-full gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="text-sm">创建歌单</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { mainMenuItems, libraryMenuItems, defaultUserPlaylists } from '@/config/menu'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const emit = defineEmits(['show-login'])
const { isLoggedIn } = storeToRefs(userStore)
const userPlaylists = defaultUserPlaylists

// 判断路由是否匹配
const isRouteMatch = (path: string) => {
  // 处理根路径特殊情况
  if (path === '/' && route.path === '/') {
    return true
  }
  // 处理其他路径
  return route.path.startsWith(path) && path !== '/'
}

// 处理登录点击
const handleLoginClick = () => {
  emit('show-login')
}

// 组件挂载时检查路由状态
onMounted(() => {
  // 如果是首页或未匹配任何路由，设置默认选中第一个菜单
  if (route.path === '/' || !mainMenuItems.some(item => isRouteMatch(item.path || ''))) {
    router.push(mainMenuItems[0].path || '/')
  }
})
</script>

<style scoped>
.router-link-active {
  font-weight: 500;
}

/* 自定义滚动条样式 */
.hover-scrollbar::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

.hover-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 999px;
  transition: background-color 0.3s ease;
}

.hover-scrollbar::-webkit-scrollbar-button {
  display: none;
}

.hover-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb, rgba(0, 0, 0, 0.2));
}

.hover-scrollbar:hover::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover, rgba(0, 0, 0, 0.3));
}

/* Firefox 滚动条样式 */
.hover-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;
}

.hover-scrollbar:hover {
  scrollbar-color: var(--scrollbar-thumb, rgba(0, 0, 0, 0.2)) transparent;
}

/* 暗色模式下的滚动条颜色 */
:root[data-theme="dark"] .hover-scrollbar:hover {
  --scrollbar-thumb: rgba(255, 255, 255, 0.2);
  --scrollbar-thumb-hover: rgba(255, 255, 255, 0.3);
}
</style> 