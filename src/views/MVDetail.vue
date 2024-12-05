<template>
  <div class="container mx-auto p-4">
    <!-- MV标题 -->
    <h1 v-if="mvDetail" class="text-2xl font-bold mb-4">{{ mvDetail.name }}</h1>

    <!-- 视频播放器 -->
    <div class="aspect-video bg-black rounded-lg overflow-hidden mb-6">
      <video 
        v-if="mvUrl"
        ref="videoRef"
        class="w-full h-full"
        controls
        autoplay
        :src="mvUrl"
      ></video>
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="loading loading-spinner loading-lg"></div>
      </div>
    </div>

    <!-- MV信息 -->
    <div v-if="mvDetail?.artists?.length" class="space-y-4">
      <div class="flex items-center gap-4 text-base-content/70">
        <span>{{ formatPlayCount(mvDetail?.playCount) }}次播放</span>
        <span>{{ formatDate(mvDetail?.publishTime) }}</span>
      </div>
      <div class="flex items-center gap-2">
        <img 
          :src="mvDetail.artists[0].img1v1Url" 
          :alt="mvDetail.artists[0].name"
          class="w-10 h-10 rounded-full object-cover"
          @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
        />
        <div>
          <div class="font-medium">{{ mvDetail.artists[0].name }}</div>
          <div class="text-sm text-base-content/70">歌手</div>
        </div>
      </div>
      <div class="text-base-content/70">
        {{ mvDetail.desc || '暂无简介' }}
      </div>
    </div>

    <!-- 相关推荐 -->
    <div v-if="similarMVs.length" class="mt-8">
      <h2 class="text-xl font-bold mb-4">相关推荐</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- 复用搜索页面的MV卡片样式 -->
      </div>
    </div>

    <!-- 评论区 -->
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">评论 ({{ commentCount }})</h2>
      
      <!-- 评论输入框 -->
      <div class="flex gap-4 mb-6">
        <div class="w-10 h-10 flex-shrink-0">
          <div class="w-full h-full rounded-full bg-base-300"></div>
        </div>
        <div class="flex-1">
          <textarea 
            v-model="commentText"
            rows="3"
            class="textarea textarea-bordered w-full"
            placeholder="发一条友善的评论"
          ></textarea>
          <div class="flex justify-end mt-2">
            <button 
              class="btn btn-primary btn-sm"
              :disabled="!commentText.trim()"
              @click="handleComment"
            >
              评论
            </button>
          </div>
        </div>
      </div>

      <!-- 评论列表 -->
      <div class="space-y-6">
        <!-- 热门评论 -->
        <div v-if="hotComments.length" class="space-y-4">
          <h3 class="font-bold text-base">热门评论</h3>
          <div 
            v-for="comment in hotComments" 
            :key="comment.commentId"
            class="flex gap-4"
          >
            <img 
              :src="comment.user.avatarUrl" 
              :alt="comment.user.nickname"
              class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex-1">
              <div class="bg-base-200 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-medium hover:text-primary cursor-pointer">{{ comment.user.nickname }}</span>
                  <span class="text-xs text-base-content/50">{{ formatDate(comment.time) }}</span>
                </div>
                <p>{{ comment.content }}</p>
              </div>
              <!-- 点赞和回复 -->
              <div class="flex items-center gap-4 mt-2 text-sm">
                <button class="flex items-center gap-1 hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>{{ formatCount(comment.likedCount) }}</span>
                </button>
                <button class="hover:text-primary transition-colors">回复</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 最新评论 -->
        <div class="space-y-4">
          <h3 class="font-bold text-base">最新评论</h3>
          <div 
            v-for="comment in comments" 
            :key="comment.commentId"
            class="flex gap-4"
          >
            <img 
              :src="comment.user.avatarUrl" 
              :alt="comment.user.nickname"
              class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex-1">
              <div class="bg-base-200 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-medium hover:text-primary cursor-pointer">{{ comment.user.nickname }}</span>
                  <span class="text-xs text-base-content/50">{{ formatDate(comment.time) }}</span>
                </div>
                <p>{{ comment.content }}</p>
              </div>
              <!-- 点赞和回复 -->
              <div class="flex items-center gap-4 mt-2 text-sm">
                <button class="flex items-center gap-1 hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>{{ formatCount(comment.likedCount) }}</span>
                </button>
                <button class="hover:text-primary transition-colors">回复</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div 
          v-if="hasMore" 
          class="flex justify-center py-4"
        >
          <button 
            class="btn btn-ghost btn-sm"
            :class="{ loading: isLoadingMore }"
            @click="loadMoreComments"
          >
            加载更多
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { mvService } from '@/services/mv'

const route = useRoute()
const videoRef = ref<HTMLVideoElement | null>(null)
const mvUrl = ref('')
const mvDetail = ref<any>(null)
const similarMVs = ref<any[]>([])

// 评论相关
const commentText = ref('')
const comments = ref<any[]>([])
const hotComments = ref<any[]>([])
const commentCount = ref(0)
const commentOffset = ref(0)
const commentLimit = 20
const hasMore = ref(true)
const isLoadingMore = ref(false)

// 格式化播放量
const formatPlayCount = (count: number | undefined): string => {
  if (!count) return '0'
  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}亿`
  }
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return count.toString()
}

// 格式化日期
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 获取MV详情和播放地址
const fetchMVData = async () => {
  try {
    const id = Number(route.params.id)
    const [urlRes, detailRes] = await Promise.all([
      mvService.getMVUrl(id),
      mvService.getMVDetail(id)
    ])
    
    if (urlRes.data.code === 200) {
      mvUrl.value = urlRes.data.data.url
    }
    
    if (detailRes.data.code === 200) {
      mvDetail.value = detailRes.data.data
    }
  } catch (error) {
    console.error('获取MV数据失败:', error)
  }
}

// 获取评论
const fetchComments = async (offset = 0) => {
  try {
    const id = Number(route.params.id)
    const { data } = await mvService.getComments(id, offset, commentLimit)
    if (data.code === 200) {
      if (offset === 0) {
        comments.value = data.comments || []
        hotComments.value = data.hotComments || []
      } else {
        comments.value = [...comments.value, ...(data.comments || [])]
      }
      commentCount.value = data.total || 0
      hasMore.value = comments.value.length < (data.total || 0)
    }
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

// 加载更多评论
const loadMoreComments = async () => {
  if (isLoadingMore.value) return
  isLoadingMore.value = true
  commentOffset.value += commentLimit
  await fetchComments(commentOffset.value)
  isLoadingMore.value = false
}

// 发表评论
const handleComment = async () => {
  if (!commentText.value.trim()) return
  try {
    const id = Number(route.params.id)
    const { data } = await mvService.comment(id, commentText.value)
    if (data.code === 200) {
      commentText.value = ''
      // 重新加载评论
      commentOffset.value = 0
      await fetchComments()
    }
  } catch (error) {
    console.error('发表评论失败:', error)
  }
}

// 格式化数字
const formatCount = (count: number | undefined): string => {
  if (!count) return '0'
  if (count >= 100000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return count.toString()
}

onMounted(async () => {
  await Promise.all([
    fetchMVData(),
    fetchComments()
  ])
})
</script> 