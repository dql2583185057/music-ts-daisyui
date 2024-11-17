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

    <!-- 加载状态 -->
    <div v-if="isLoading && !songs.length" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- 搜索结果列表 -->
    <template v-else>
      <!-- 综合搜索结果 -->
      <template v-if="activeTab === '1018'">
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
              <figure class="aspect-square">
                <img 
                  :src="playlist.coverImgUrl" 
                  :alt="playlist.name" 
                  class="w-full h-full object-cover"
               
                />
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
          <figure class="aspect-square">
            <img 
              :src="playlist.coverImgUrl" 
              :alt="playlist.name" 
              class="w-full h-full object-cover"
           
            />
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
        >
          <figure class="relative aspect-video">
            <img 
              :src="mv.cover" 
              :alt="mv.name" 
              class="w-full h-full object-cover"
              
            />
            <div class="absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              {{ formatPlayCount(mv.playCount) }}
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

    <!-- 加载更多 -->
    <div 
      v-if="hasMore && !isLoading" 
      class="flex justify-center mt-8"
      ref="loadMoreRef"
    >
      <div class="loading loading-spinner loading-lg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchService } from '@/services/search'
import SongList from '@/components/SongList.vue'
import type { Song, Artist, Album, Playlist, MV, Video, User, Radio } from '@/types/music'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const activeTab = ref('1018')
const isLoading = ref(false)
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

// 加载更多
const loadMore = async () => {
  if (isLoading.value || !hasMore.value || !searchQuery.value) return

  try {
    isLoading.value = true
    const res = await searchService.search(
      searchQuery.value,
      activeTab.value === '1018' ? '1' : activeTab.value, // 综合搜索时使用单曲类型
      offset.value,
      pageSize
    )
    
    if (res.code === 200) {
      const result = res.result

      // 设置总数和数据
      switch (activeTab.value) {
        case '1018': // 综合搜索
          if (result.songs) {
            songs.value = result.songs.slice(0, 10) // 只显示前10首歌
          }
          // 加载其他类型的数据
          loadOtherTypes()
          break
        case '1':
          totalResults.value = result.songCount || 0
          if (result.songs) songs.value = [...songs.value, ...result.songs]
          break
        case '100':
          totalResults.value = result.artistCount || 0
          if (result.artists) artists.value = [...artists.value, ...result.artists]
          break
        case '10':
          totalResults.value = result.albumCount || 0
          if (result.albums) albums.value = [...albums.value, ...result.albums]
          break
        case '1000':
          totalResults.value = result.playlistCount || 0
          if (result.playlists) playlists.value = [...playlists.value, ...result.playlists]
          break
        case '1004':
          totalResults.value = result.mvCount || 0
          if (result.mvs) mvs.value = [...mvs.value, ...result.mvs]
          break
        case '1002':
          totalResults.value = result.userprofileCount || 0
          if (result.userprofiles) users.value = [...users.value, ...result.userprofiles]
          break
        case '1009':
          totalResults.value = result.djRadiosCount || 0
          if (result.djRadios) radios.value = [...radios.value, ...result.djRadios]
          break
      }

      offset.value += pageSize
      hasMore.value = offset.value < totalResults.value

      // 如果��有更多数据且当前数据不足以滚动，继续加载
      if (hasMore.value && !isScrollable() && !isLoading.value) {
        await loadMore()
      }
    }
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载其他类型的数据
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
  
  activeTab.value = type
  offset.value = 0
  hasMore.value = true
  clearResults()
  
  // 切换标签后立即加载新数据
  await loadMore()
  
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
  offset.value = 0
  totalResults.value = 0
}

// 监听路由参数变化
watch(
  () => route.query,
  async (query) => {
    const newQuery = query.q as string
    const newType = query.type as string || '1018'
    
    if (newQuery !== searchQuery.value) {
      // 搜索词改变，重置所有状态并搜索
      searchQuery.value = newQuery
      activeTab.value = newType
      offset.value = 0
      hasMore.value = true
      clearResults()
      await loadMore()
    } else if (newType !== activeTab.value) {
      // 只改变了类型，不需要在这里触发搜索，因为switchTab会处理
      activeTab.value = newType
    }
  },
  { immediate: true }
)

// 监听滚动
const handleScroll = () => {
  if (!isLoading.value && hasMore.value) {
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight

    if (scrollHeight - scrollTop - clientHeight < 100) {
      loadMore()
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

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