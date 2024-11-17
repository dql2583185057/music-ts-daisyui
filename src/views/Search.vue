<template>
  <div class="container mx-auto">
    <!-- 搜索结果统计 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">搜索 "{{ searchQuery }}"</h1>
      <p class="text-base-content/70 mt-2">找到 {{ totalResults }} 个相关结果</p>
    </div>

    <!-- 搜索结果分类 -->
    <div class="flex items-center gap-4 mb-6 border-b border-base-300">
      <a 
        v-for="tab in tabs" 
        :key="tab.type"
        class="px-4 py-3 relative cursor-pointer transition-colors"
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

    <!-- 搜索结果列表 -->
    <div class="overflow-x-auto">
      <!-- 单曲 -->
      <div v-if="activeTab === '1'" class="space-y-4">
        <table class="table">
          <thead>
            <tr>
              <th class="w-16">#</th>
              <th>歌曲</th>
              <th>歌手</th>
              <th>专辑</th>
              <th class="w-24">时长</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(song, index) in songs" :key="song.id" class="hover">
              <td class="text-base-content/50">{{ index + 1 }}</td>
              <td>
                <div class="flex items-center gap-3">
                  <img 
                    :src="song.album.picUrl" 
                    class="w-10 h-10 rounded object-cover"
                  />
                  <span>{{ song.name }}</span>
                </div>
              </td>
              <td>{{ song.artists.map(a => a.name).join('/') }}</td>
              <td>{{ song.album.name }}</td>
              <td class="text-base-content/50">{{ formatDuration(song.duration) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 歌单 -->
      <div v-if="activeTab === '1000'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="playlist in playlists" 
          :key="playlist.id"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
          @click="router.push(`/playlist/${playlist.id}`)"
        >
          <figure class="aspect-square">
            <img 
              :src="playlist.coverImgUrl" 
              :alt="playlist.name" 
              class="w-full h-full object-cover"
            />
          </figure>
          <div class="card-body p-3">
            <h2 class="card-title text-sm line-clamp-2">{{ playlist.name }}</h2>
            <p class="text-xs text-base-content/70">
              {{ playlist.trackCount }}首
              <span v-if="playlist.creator" class="ml-1">by {{ playlist.creator.nickname }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 歌手 -->
      <div v-if="activeTab === '100'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="artist in artists" 
          :key="artist.id"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
        >
          <figure class="aspect-square">
            <img :src="artist.img1v1Url" alt="头像" class="w-full h-full object-cover rounded-full" />
          </figure>
          <div class="card-body p-3 text-center">
            <h2 class="font-bold">{{ artist.name }}</h2>
            <p class="text-xs text-base-content/70">单曲：{{ artist.musicSize }}</p>
          </div>
        </div>
      </div>

      <!-- 专辑 -->
      <div v-if="activeTab === '10'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="album in albums" 
          :key="album.id"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
        >
          <figure class="aspect-square">
            <img :src="album.picUrl" alt="封面" class="w-full h-full object-cover" />
          </figure>
          <div class="card-body p-3">
            <h2 class="card-title text-sm line-clamp-2">{{ album.name }}</h2>
            <p class="text-xs text-base-content/70">{{ album.artist.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div 
      v-if="hasMore" 
      class="flex justify-center mt-8"
      v-intersection="loadMore"
    >
      <div class="loading loading-spinner loading-lg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchService } from '@/services/search'
import { vIntersection } from '@/directives/intersection'
import type { Song, Playlist, Artist, Album } from '@/types/music'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const activeTab = ref('1')
const isLoading = ref(false)
const hasMore = ref(true)
const offset = ref(0)
const pageSize = 20
const totalResults = ref(0)

// 搜索结果
const songs = ref<Song[]>([])
const playlists = ref<Playlist[]>([])
const artists = ref<Artist[]>([])
const albums = ref<Album[]>([])

// 标签页配置
const tabs = [
  { type: '1', name: '单曲' },
  { type: '1000', name: '歌单' },
  { type: '100', name: '歌手' },
  { type: '10', name: '专辑' }
]

// 格式化时长
const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 1000 / 60)
  const seconds = Math.floor((duration / 1000) % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 加载更多
const loadMore = async () => {
  if (isLoading.value || !hasMore.value || !searchQuery.value) return

  try {
    isLoading.value = true
    const res = await searchService.search(
      searchQuery.value,
      activeTab.value,
      offset.value,
      pageSize
    )
    
    if (res.code === 200) {
      const result = res.result
      totalResults.value = result.songCount || result.playlistCount || result.artistCount || result.albumCount || 0

      // 追加新数据
      switch (activeTab.value) {
        case '1':
          if (result.songs) {
            songs.value = [...songs.value, ...result.songs]
          }
          break
        case '1000':
          if (result.playlists) {
            playlists.value = [...playlists.value, ...result.playlists]
          }
          break
        case '100':
          if (result.artists) {
            artists.value = [...artists.value, ...result.artists]
          }
          break
        case '10':
          if (result.albums) {
            albums.value = [...albums.value, ...result.albums]
          }
          break
      }

      offset.value += pageSize
      hasMore.value = offset.value < totalResults.value
    }
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 切换标签
const switchTab = (type: string) => {
  if (type === activeTab.value) return
  
  activeTab.value = type
  offset.value = 0
  hasMore.value = true
  
  // 清空当前类型的数据
  switch (type) {
    case '1':
      songs.value = []
      break
    case '1000':
      playlists.value = []
      break
    case '100':
      artists.value = []
      break
    case '10':
      albums.value = []
      break
  }
  
  loadMore()
  
  router.replace({ 
    query: { 
      ...route.query,
      type
    }
  })
}

// 监听路由参数变化
watch(
  () => route.query,
  (query) => {
    const newQuery = query.q as string
    const newType = query.type as string || '1'
    
    if (newQuery !== searchQuery.value) {
      searchQuery.value = newQuery
      activeTab.value = newType
      offset.value = 0
      hasMore.value = true
      songs.value = []
      playlists.value = []
      artists.value = []
      albums.value = []
      loadMore()
    } else if (newType !== activeTab.value) {
      switchTab(newType)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 