<template>
  <div class="container mx-auto">
    <!-- 搜索结果统计 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">搜索 "{{ searchQuery }}"</h1>
      <p class="text-base-content/70 mt-2">
        找到 {{ totalResults }} 个相关{{ getTabName(activeTab) }}
      </p>
    </div>

    <!-- 搜索结果分类 -->
    <div class="flex items-center gap-4 mb-6 border-b border-base-300 overflow-x-auto">
      <a 
        v-for="tab in tabs" 
        :key="tab.type"
        class="px-4 py-3 relative cursor-pointer transition-colors whitespace-nowrap"
        :class="{ 
          'text-primary font-medium': activeTab === tab.type,
          'hover:text-primary/70': activeTab !== tab.type
        }"
        @click="switchTab(tab.type)"
      >
        <span>{{ tab.name }}</span>
        <!-- 活动指示器 -->
        <div 
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform duration-300"
          :class="{ 'scale-x-100': activeTab === tab.type, 'scale-x-0': activeTab !== tab.type }"
        ></div>
      </a>
    </div>

    <!-- 加载 -->
    <div v-if="isLoading && !songs.length" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- 搜索结果列表 -->
    <template v-else>
      <!-- 综合搜索结果 -->
      <template v-if="activeTab === '1018'">
        <!-- 原唱歌手 -->
        <div v-if="result?.artist" class="mb-8">
          <div class="flex gap-6 bg-base-200/50 rounded-box p-6">
            <div class="flex items-center gap-6 flex-1">
              <div class="relative w-32 h-32 rounded-full overflow-hidden group">
                <img 
                  :src="result.artist.img1v1Url" 
                  :alt="result.artist.name" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
                />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-2" v-html="highlightKeyword(result.artist.name)"></h3>
                <div class="flex gap-6 text-sm text-base-content/70 mb-4">
                  <div>
                    <span class="font-medium">单曲数：</span>
                    <span>{{ result.artist.musicSize || 0 }}</span>
                  </div>
                  <div>
                    <span class="font-medium">专辑数：</span>
                    <span>{{ result.artist.albumSize || 0 }}</span>
                  </div>
                </div>
                <div class="text-sm text-base-content/70 mb-4">
                  原唱歌手
                </div>
                <div class="flex gap-2">
                  <button class="btn btn-primary btn-sm gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    播放热门歌曲
                  </button>
                  <button class="btn btn-outline btn-sm">+ 关注</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 单曲 -->
        <div v-if="songs.length" class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">单曲</h2>
            <router-link 
              :to="{ query: { ...route.query, type: '1' }}"
              class="text-sm text-primary hover:text-primary/80"
            >
              查看全部
            </router-link>
          </div>
          <SongList 
            :songs="songs"
            :keyword="searchQuery"
          />
        </div>

        <!-- 歌手 -->
        <div v-if="artists.length" class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">歌手</h2>
            <router-link 
              :to="{ query: { ...route.query, type: '100' }}"
              class="text-sm text-primary hover:text-primary/80"
            >
              查看全部
            </router-link>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              v-for="artist in artists" 
              :key="artist.id"
              class="card bg-transparent hover:bg-base-200 transition-all duration-300 cursor-pointer group"
            >
              <figure class="p-4">
                <div class="w-full aspect-square rounded-full overflow-hidden group-hover:ring-4 ring-primary/20 transition-all duration-300">
                  <img 
                    :src="artist.img1v1Url" 
                    :alt="artist.name" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
                  />
                </div>
              </figure>
              <div class="card-body p-3 text-center">
                <h2 class="font-bold text-base truncate" v-html="highlightKeyword(artist.name)"></h2>
                <p class="text-xs text-base-content/70">
                  单曲：{{ artist.musicSize || 0 }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 专辑 -->
        <div v-if="albums.length" class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">专辑</h2>
            <router-link 
              :to="{ query: { ...route.query, type: '10' }}"
              class="text-sm text-primary hover:text-primary/80"
            >
              查看全部
            </router-link>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              v-for="album in albums.slice(0, 6)" 
              :key="album.id"
              class="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer group"
            >
              <figure class="aspect-square">
                <img 
                  :src="album.picUrl" 
                  :alt="album.name" 
                  class="w-full h-full object-cover"
               
                />
              </figure>
              <div class="card-body p-3">
                <h2 class="card-title text-sm line-clamp-2" v-html="highlightKeyword(album.name)"></h2>
                <p class="text-xs text-base-content/70" v-html="highlightKeyword(album.artist.name)"></p>
              </div>
            </div>
          </div>
        </div>

        <!-- 歌单 -->
        <div v-if="playlists.length" class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">歌单</h2>
            <router-link 
              :to="{ query: { ...route.query, type: '1000' }}"
              class="text-sm text-primary hover:text-primary/80"
            >
              查看全部
            </router-link>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              v-for="playlist in playlists.slice(0, 6)" 
              :key="playlist.id"
              class="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer group"
            >
              <figure class="relative aspect-square">
                <img 
                  :src="playlist.coverImgUrl" 
                  :alt="playlist.name" 
                  class="w-full h-full object-cover"
                  @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
                />
                <!-- 播放量 -->
                <div class="absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  {{ formatPlayCount(playlist.playCount) }}
                </div>
              </figure>
              <div class="card-body p-3">
                <h2 class="card-title text-sm line-clamp-2" v-html="highlightKeyword(playlist.name)"></h2>
                <p class="text-xs text-base-content/70">
                  {{ playlist.trackCount }}首
                  <span v-if="playlist.creator" class="ml-1">by {{ playlist.creator.nickname }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- MV -->
        <div v-if="mvs.length" class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">MV</h2>
            <router-link 
              :to="{ query: { ...route.query, type: '1004' }}"
              class="text-sm text-primary hover:text-primary/80"
            >
              查看全部
            </router-link>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              v-for="mv in mvs.slice(0, 4)" 
              :key="mv.id"
              class="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer group"
              @click="handleMVClick(mv.id)"
            >
              <figure class="relative aspect-video overflow-hidden">
                <img 
                  :src="mv.cover" 
                  :alt="mv.name" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
                />
                <!-- 播放图标 - 悬浮时显示 -->
                <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <!-- 播放量 -->
                <div class="absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  {{ formatPlayCount(mv.playCount) }}
                </div>
                <!-- 视频时长 -->
                <div class="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                  {{ formatDuration(mv.duration) }}
                </div>
              </figure>
              <div class="card-body p-3">
                <h2 class="card-title text-sm line-clamp-2" v-html="highlightKeyword(mv.name)"></h2>
                <p class="text-xs text-base-content/70" v-html="highlightKeyword(mv.artistName)"></p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 单曲 -->
      <SongList 
        v-if="activeTab === '1'" 
        :songs="songs"
        :keyword="searchQuery"
      />

      <!-- 歌手 -->
      <div v-if="activeTab === '100'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="artist in artists" 
          :key="artist.id"
          class="card bg-transparent hover:bg-base-200 transition-all duration-300 cursor-pointer group"
        >
          <figure class="p-4">
            <div class="w-full aspect-square rounded-full overflow-hidden group-hover:ring-4 ring-primary/20 transition-all duration-300">
              <img 
                :src="artist.img1v1Url" 
                :alt="artist.name" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
           
              />
            </div>
          </figure>
          <div class="card-body p-3 text-center">
            <h2 class="font-bold text-base truncate" v-html="highlightKeyword(artist.name)"></h2>
            <p class="text-xs text-base-content/70">
              单曲：{{ artist.musicSize || 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- 专辑 -->
      <div v-if="activeTab === '10'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="album in albums" 
          :key="album.id"
          class="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer group"
        >
          <figure class="aspect-square">
            <img 
              :src="album.picUrl" 
              :alt="album.name" 
              class="w-full h-full object-cover"
           
            />
          </figure>
          <div class="card-body p-3">
            <h2 class="card-title text-sm line-clamp-2" v-html="highlightKeyword(album.name)"></h2>
            <p class="text-xs text-base-content/70" v-html="highlightKeyword(album.artist.name)"></p>
          </div>
        </div>
      </div>

      <!-- 歌单 -->
      <div v-if="activeTab === '1000'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="playlist in playlists" 
          :key="playlist.id"
          class="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer group"
        >
          <figure class="relative aspect-square">
            <img 
              :src="playlist.coverImgUrl" 
              :alt="playlist.name" 
              class="w-full h-full object-cover"
              @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
            />
            <!-- 播放量 -->
            <div class="absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              {{ formatPlayCount(playlist.playCount) }}
            </div>
          </figure>
          <div class="card-body p-3">
            <h2 class="card-title text-sm line-clamp-2" v-html="highlightKeyword(playlist.name)"></h2>
            <p class="text-xs text-base-content/70">
              {{ playlist.trackCount }}首
              <span v-if="playlist.creator" class="ml-1">by {{ playlist.creator.nickname }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- MV -->
      <div v-if="activeTab === '1004'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div 
          v-for="mv in mvs" 
          :key="mv.id"
          class="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer group"
          @click="handleMVClick(mv.id)"
        >
          <figure class="relative aspect-video overflow-hidden">
            <img 
              :src="mv.cover" 
              :alt="mv.name" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
            />
            <!-- 播放图标 - 悬浮时显示 -->
            <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <!-- 播放量 -->
            <div class="absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              {{ formatPlayCount(mv.playCount) }}
            </div>
            <!-- 视频时长 -->
            <div class="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {{ formatDuration(mv.duration) }}
            </div>
          </figure>
          <div class="card-body p-3">
            <h2 class="card-title text-sm line-clamp-2" v-html="highlightKeyword(mv.name)"></h2>
            <p class="text-xs text-base-content/70" v-html="highlightKeyword(mv.artistName)"></p>
          </div>
        </div>
      </div>

      <!-- 用户 -->
      <div v-if="activeTab === '1002'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="user in users" 
          :key="user.userId"
          class="card bg-transparent hover:bg-base-200 transition-all duration-300 cursor-pointer group"
        >
          <figure class="p-4">
            <div class="w-full aspect-square rounded-full overflow-hidden group-hover:ring-4 ring-primary/20 transition-all duration-300">
              <img 
                :src="user.avatarUrl" 
                :alt="user.nickname" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            
              />
            </div>
          </figure>
          <div class="card-body p-3 text-center">
            <h2 class="font-bold text-base truncate" v-html="highlightKeyword(user.nickname)"></h2>
            <p v-if="user.signature" class="text-xs text-base-content/70 line-clamp-2" v-html="highlightKeyword(user.signature)"></p>
          </div>
        </div>
      </div>

      <!-- 电台 -->
      <div v-if="activeTab === '1009'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="radio in radios" 
          :key="radio.id"
          class="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer"
        >
          <figure>
            <img 
              :src="radio.picUrl" 
              :alt="radio.name" 
              class="w-full aspect-square object-cover"
              @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
            />
          </figure>
          <div class="card-body p-3">
            <h2 class="card-title text-sm line-clamp-1" v-html="highlightKeyword(radio.name)"></h2>
            <p v-if="radio.desc" class="text-xs text-base-content/70 line-clamp-2" v-html="highlightKeyword(radio.desc)"></p>
          </div>
        </div>
      </div>
    </template>

    <!-- 加载更多提示 -->
    <div 
      v-if="hasMore" 
      class="flex justify-center py-8"
    >
      <div v-if="isLoading || isLoadingMore" class="loading loading-spinner loading-lg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchService } from '@/services/search'
import SongList from '@/components/SongList.vue'
import type { Song, Artist, Album, Playlist, MV, Video, User, Radio } from '@/types/music'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const activeTab = ref('1018')
const isLoading = ref(false)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const offset = ref(0)
const pageSize = 30
const totalResults = ref(0)

// 搜索结果
const songs = ref<Song[]>([])
const artists = ref<Artist[]>([])
const albums = ref<Album[]>([])
const playlists = ref<Playlist[]>([])
const mvs = ref<MV[]>([])
const videos = ref<Video[]>([])
const users = ref<User[]>([])
const radios = ref<Radio[]>([])

// 添加result的响应式引用
const result = ref<any>(null)

// 标签页配置
const tabs = [
  { type: '1018', name: '综合' },
  { type: '1', name: '单曲' },
  { type: '100', name: '歌手' },
  { type: '10', name: '专辑' },
  { type: '1000', name: '歌单' },
  { type: '1004', name: 'MV' },
  { type: '1002', name: '用户' },
  { type: '1009', name: '电台' }
]

// 获取标签名称
const getTabName = (type: string) => {
  const tab = tabs.find(t => t.type === type)
  return tab ? tab.name : '结果'
}

// 获取当前分类的数据列表
const getCurrentList = () => {
  switch (activeTab.value) {
    case '1':
      return songs
    case '100':
      return artists
    case '10':
      return albums
    case '1000':
      return playlists
    case '1004':
      return mvs
    case '1014':
      return videos
    case '1002':
      return users
    case '1009':
      return radios
    default:
      return songs
  }
}

// 防抖函数
const debounce = (fn: Function, delay: number) => {
  let timer: number | null = null
  return (...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(null, args)
    }, delay) as unknown as number
  }
}

// 监听滚动
const handleScroll = () => {
  if (isLoading.value || isLoadingMore.value || !hasMore.value) return

  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight = document.documentElement.clientHeight

  // 当距离底部200px时加载更多
  if (scrollHeight - scrollTop - clientHeight < 200) {
    loadMore()
  }
}

// 组件挂载和卸载时添加/移除滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 加载更多
const loadMore = async () => {
  if (isLoading.value || isLoadingMore.value || !hasMore.value || !searchQuery.value) return

  try {
    isLoadingMore.value = true
    const res = await searchService.search(
      searchQuery.value,
      activeTab.value,
      offset.value,
      pageSize
    )
    
    if (res.code === 200) {
      // 保存整个结果对象
      result.value = res.result

      // 设置总数和数据
      switch (activeTab.value) {
        case '1018': // 综合搜索
          if (res.result.songs) {
            songs.value = res.result.songs.slice(0, 10)
          }
          if (res.result.artists) {
            artists.value = res.result.artists.slice(0, 6)
          }
          if (res.result.albums) {
            albums.value = res.result.albums.slice(0, 6)
          }
          if (res.result.playlists) {
            playlists.value = res.result.playlists.slice(0, 6)
          }
          if (res.result.mvs) {
            mvs.value = res.result.mvs.slice(0, 4)
          }
          break
        case '1':
          totalResults.value = res.result.songCount || 0
          if (res.result.songs) {
            const newSongs = [...songs.value]
            res.result.songs.forEach(song => {
              if (!newSongs.some(s => s.id === song.id)) {
                newSongs.push(song)
              }
            })
            songs.value = newSongs
          }
          break
        case '100':
          totalResults.value = res.result.artistCount || 0
          if (res.result.artists) {
            const newArtists = [...artists.value]
            res.result.artists.forEach(artist => {
              if (!newArtists.some(a => a.id === artist.id)) {
                newArtists.push(artist)
              }
            })
            artists.value = newArtists
          }
          break
        case '10':
          totalResults.value = res.result.albumCount || 0
          if (res.result.albums) albums.value = [...albums.value, ...res.result.albums]
          break
        case '1000':
          totalResults.value = res.result.playlistCount || 0
          if (res.result.playlists) playlists.value = [...playlists.value, ...res.result.playlists]
          break
        case '1004':
          totalResults.value = res.result.mvCount || 0
          if (res.result.mvs) mvs.value = [...mvs.value, ...res.result.mvs]
          break
        case '1002':
          totalResults.value = res.result.userprofileCount || 0
          if (res.result.userprofiles) users.value = [...users.value, ...res.result.userprofiles]
          break
        case '1009':
          totalResults.value = res.result.djRadiosCount || 0
          if (res.result.djRadios) radios.value = [...radios.value, ...res.result.djRadios]
          break
      }

      offset.value += pageSize
      hasMore.value = offset.value < totalResults.value
    }
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    isLoadingMore.value = false
  }
}

// 加载他类型的数据
const loadOtherTypes = async () => {
  try {
    // 加载歌手
    const artistRes = await searchService.search(searchQuery.value, '100', 0, 6)
    if (artistRes.code === 200 && artistRes.result.artists) {
      artists.value = artistRes.result.artists
    }

    // 加载专辑
    const albumRes = await searchService.search(searchQuery.value, '10', 0, 6)
    if (albumRes.code === 200 && albumRes.result.albums) {
      albums.value = albumRes.result.albums
    }

    // 加载歌单
    const playlistRes = await searchService.search(searchQuery.value, '1000', 0, 6)
    if (playlistRes.code === 200 && playlistRes.result.playlists) {
      playlists.value = playlistRes.result.playlists
    }
  } catch (error) {
    console.error('加载其他类型数据失败:', error)
  }
}

// 检查是否可以滚动
const isScrollable = () => {
  return document.documentElement.scrollHeight > window.innerHeight
}

// 切换标签
const switchTab = async (type: string) => {
  if (type === activeTab.value) return
  
  router.replace({ 
    query: { 
      ...route.query,
      type
    }
  })
}

// 清空结果
const clearResults = () => {
  songs.value = []
  artists.value = []
  albums.value = []
  playlists.value = []
  mvs.value = []
  users.value = []
  radios.value = []
  result.value = null // 清空result
  offset.value = 0
  totalResults.value = 0
}

// 监听路由参数变化
watch(
  () => route.query,
  async (query) => {
    const newQuery = query.q as string
    const newType = query.type as string || '1018'
    
    if (newQuery !== searchQuery.value || newType !== activeTab.value) {
      searchQuery.value = newQuery
      activeTab.value = newType
      offset.value = 0
      hasMore.value = true
      clearResults()
      window.scrollTo(0, 0)
      await loadMore()
    }
  },
  { immediate: true }
)

// 高亮搜索关键词
const highlightKeyword = (text: string): string => {
  if (!searchQuery.value || !text) return text
  const reg = new RegExp(searchQuery.value, 'gi')
  return text.replace(reg, match => `<span class="keyword-highlight">${match}</span>`)
}

// 格式化播放量
const formatPlayCount = (count: number): string => {
  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}亿`
  }
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return count.toString()
}

// 格式化视频时长
const formatDuration = (duration: number): string => {
  // duration是毫秒，需要转换为秒
  const totalSeconds = Math.floor(duration / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  // 如果分钟数大于等于60，需要显示时
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainMinutes = minutes % 60
    return `${hours}:${remainMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  // 否则只显示分钟和秒
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 处理MV点击
const handleMVClick = (id: number) => {
  router.push(`/mv/${id}`)
}
</script>

<style scoped>
/* 隐藏滚动条但保持可滚动 */
.overflow-x-auto {
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

:deep(.keyword-highlight) {
  color: hsl(var(--p));
}
</style> 