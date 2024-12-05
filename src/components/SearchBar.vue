<template>
  <div :class="$attrs.class">
    <div class="flex items-center gap-4">
      <!-- 导航按钮组 - 在移动端隐藏 -->
      <div class="hidden lg:flex items-center gap-2">
        <!-- 后退按钮 -->
        <button 
          class="btn btn-circle btn-sm btn-ghost hover:bg-base-300 transition-all"
          @click="router.back()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <!-- 前进按钮 -->
        <button 
          class="btn btn-circle btn-sm btn-ghost hover:bg-base-300 transition-all"
          @click="router.forward()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- 搜索框 -->
      <div class="w-full max-w-[400px] relative group">
        <div class="form-control">
          <div class="input-group relative">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="搜索音乐、歌手、歌单..." 
              class="input input-bordered w-full text-sm lg:text-base focus:outline-none focus:border-primary" 
              @keyup.enter="handleSearch"
              @focus="showSuggestions = true"
              @blur="handleBlur"
            />
            <!-- 清空按钮 -->
            <div 
              v-if="searchQuery"
              class="absolute right-12 top-1/2 -translate-y-1/2 cursor-pointer p-2 hover:text-primary transition-colors"
              @mousedown="clearSearch"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div 
              class="bg-primary px-4 flex items-center justify-center cursor-pointer hover:brightness-110 transition-all"
              @click="handleSearch"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 搜索建议面板 -->
        <div 
          v-show="showSuggestions"
          class="absolute left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-xl overflow-hidden z-50 border border-base-200"
          @mousedown.prevent
        >
          <!-- 搜索历史 -->
          <div v-if="searchHistory.length > 0 && !searchQuery" class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-bold">搜索历史</h3>
              <button 
                class="btn btn-ghost btn-xs"
                @click="showClearConfirm = true"
              >
                清空
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="(item, index) in searchHistory" 
                :key="index"
                class="flex items-center gap-1 px-3 py-1.5 bg-base-200 hover:bg-base-300 rounded-full cursor-pointer transition-colors"
                @mousedown="selectHistory(item)"
              >
                <span class="text-sm">{{ item }}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 hover:text-error" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  @mousedown.stop="removeHistory(index)"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <!-- 热搜榜 -->
          <div v-if="!searchQuery" class="border-t border-base-200">
            <div class="p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-bold">热搜榜</h3>
                <button 
                  class="btn btn-ghost btn-xs gap-1 hover:bg-base-300 transition-colors"
                  :class="{ loading: isLoadingHot }"
                  @click="refreshHotSearch"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  刷新
                </button>
              </div>
              <div v-if="isLoadingHot" class="flex justify-center py-8">
                <span class="loading loading-spinner loading-md"></span>
              </div>
              <div v-else class="max-h-[460px] overflow-y-auto hover-scrollbar pr-2">
                <div class="space-y-2">
                  <div 
                    v-for="(item, index) in hotSearchList" 
                    :key="index"
                    class="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
                    @mousedown="selectHotSearch(item)"
                  >
                    <span 
                      class="w-5 text-center font-bold"
                      :class="[
                        index === 0 ? 'text-error' : 
                        index === 1 ? 'text-warning' : 
                        index === 2 ? 'text-success' : 
                        'text-base-content/50'
                      ]"
                    >
                      {{ index + 1 }}
                    </span>
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <span>{{ item.keyword }}</span>
                        <span v-if="index < 3" class="badge badge-sm badge-error gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                          </svg>
                        </span>
                        <span class="text-xs text-base-content/50">{{ formatSearchCount(item.score) }}</span>
                      </div>
                      <p class="text-xs text-base-content/50">{{ item.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 搜索建议 -->
          <div v-else class="p-4">
            <div v-if="isLoadingSuggestions" class="flex justify-center py-4">
              <span class="loading loading-spinner loading-sm"></span>
            </div>
            <div 
              v-else
              v-for="(suggestion, index) in searchSuggestions" 
              :key="index"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
              @mousedown="selectSuggestion(suggestion)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span v-html="highlightKeyword(suggestion)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加确认对话框 -->
  <div class="modal" :class="{ 'modal-open': showClearConfirm }">
    <div class="modal-box">
      <h3 class="font-bold text-lg">确认清空</h3>
      <p class="py-4">确定要清空所有搜索历史记录吗？</p>
      <div class="modal-action">
        <button class="btn" @click="showClearConfirm = false">取消</button>
        <button class="btn btn-error" @click="confirmClear">确定</button>
      </div>
    </div>
    <label class="modal-backdrop" @click="showClearConfirm = false">关闭</label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { searchService } from '@/services/search'
import type { HotSearchItem } from '@/types/music'

const router = useRouter()
const searchQuery = ref('')
const isLoadingHot = ref(false)
const isLoadingSuggestions = ref(false)
const showSuggestions = ref(false)
const showClearConfirm = ref(false)
const isRefreshing = ref(false)
const hotSearchList = ref<HotSearchItem[]>([])
const searchSuggestions = ref<string[]>([])
const searchHistory = ref<string[]>([])

// 获取热搜榜数据
const getHotSearchList = async () => {
  try {
    isLoadingHot.value = true
    hotSearchList.value = await searchService.getHotSearch()
  } catch (error) {
    console.error('获取热搜榜失败:', error)
    // 使用默认数据作为fallback
    hotSearchList.value = [
      { id: 1, keyword: '周杰伦新歌', hot: true, description: '新歌发布', score: 100 },
      { id: 2, keyword: 'Taylor Swift', hot: true, description: '新专辑预告', score: 95 },
      { id: 3, keyword: '林俊杰', hot: false, description: '演唱会门票', score: 90 },
      { id: 4, keyword: 'BLACKPINK', hot: true, description: '回归舞台', score: 85 },
      { id: 5, keyword: '陈奕迅', hot: false, description: '新歌MV', score: 80 }
    ]
  } finally {
    isLoadingHot.value = false
  }
}

// 监听搜索输入，获取搜索建议
watch(searchQuery, async (newQuery) => {
  if (newQuery) {
    try {
      isLoadingSuggestions.value = true
      const res = await searchService.getSearchSuggestions(newQuery)
      searchSuggestions.value = res
    } catch (error) {
      console.error('获取搜索建议失败:', error)
      searchSuggestions.value = []
    } finally {
      isLoadingSuggestions.value = false
    }
  } else {
    searchSuggestions.value = []
  }
})

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  const input = document.querySelector('input') as HTMLInputElement
  input?.focus()
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    addToHistory(searchQuery.value.trim())
    router.push({
      path: '/search',
      query: { 
        q: searchQuery.value.trim(),
        type: '1018'
      }
    })
    showSuggestions.value = false
  }
}

// 处理失焦
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 格式化搜索数量
const formatSearchCount = (count: number) => {
  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}亿`
  }
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return count.toString()
}

// 选择搜索建议
const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  handleSearch()
}

// 选择热搜
const selectHotSearch = (item: HotSearchItem) => {
  searchQuery.value = item.keyword
  handleSearch()
}

// 选择历史记录
const selectHistory = (keyword: string) => {
  searchQuery.value = keyword
  handleSearch()
}

// 添加到历史记录
const addToHistory = (keyword: string) => {
  const index = searchHistory.value.indexOf(keyword)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }
  searchHistory.value.unshift(keyword)
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop()
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 移除历史记录
const removeHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 清空历史记录
const clearHistory = () => {
  showClearConfirm.value = true
}

// 确认清空历史记录
const confirmClear = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
  showClearConfirm.value = false
}

// 刷新热搜榜
const refreshHotSearch = () => {
  getHotSearchList()
}

// 初始化
onMounted(() => {
  // 获取热搜榜数据
  getHotSearchList()
  
  // 初始化历史记录
  const history = localStorage.getItem('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
})

// 点击其他区域关闭建议面板
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.form-control')) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 高亮搜索关键词
const highlightKeyword = (text: string): string => {
  if (!searchQuery.value || !text) return text
  const reg = new RegExp(searchQuery.value, 'gi')
  return text.replace(reg, match => `<span class="text-primary">${match}</span>`)
}
</script>

<style scoped>
.btn-circle {
  @apply transition-all duration-200;
}
</style> 