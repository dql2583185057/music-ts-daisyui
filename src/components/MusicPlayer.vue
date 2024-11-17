<template>
  <div class="w-full bg-base-200 border-t border-base-300">
    <!-- 进度条 -->
    <div class="relative h-1 bg-base-300 cursor-pointer group">
      <div class="absolute inset-y-0 left-0 bg-primary transition-all duration-200" style="width: 30%;"></div>
      <!-- 进度条小球 -->
      <div 
        class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style="left: 30%;"
      ></div>
      <!-- 时间提示 -->
      <div 
        class="absolute -top-8 px-2 py-1 bg-base-300 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        style="left: 30%;"
      >
        01:30 / 03:30
      </div>
    </div>

    <div class="p-4 grid grid-cols-3 items-center">
      <!-- 歌曲信息 -->
      <div class="flex items-center gap-4 min-w-0">
        <div class="relative group">
          <img 
            :src="currentSong?.cover || 'https://via.placeholder.com/50'" 
            class="w-12 h-12 lg:w-14 lg:h-14 rounded-lg object-cover flex-shrink-0 transition-transform group-hover:scale-105"
            alt="封面"
          />
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        <div class="min-w-0">
          <h3 class="font-bold truncate hover:text-primary cursor-pointer transition-colors">
            {{ currentSong?.title || '未播放' }}
          </h3>
          <p class="text-sm opacity-70 truncate hover:opacity-100 cursor-pointer transition-opacity">
            {{ currentSong?.artist || '-' }}
          </p>
        </div>
      </div>

      <!-- 播放控制 -->
      <div class="flex items-center justify-center gap-4 lg:gap-6">
        <!-- 随机播放 -->
        <button class="btn btn-circle btn-ghost btn-sm hidden lg:flex hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
        <!-- 上一首 -->
        <button class="btn btn-circle btn-ghost btn-sm hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <!-- 播放/暂停 -->
        <button 
          class="btn btn-circle btn-primary shadow-lg hover:scale-105 active:scale-95 transition-all"
          @click="togglePlay"
        >
          <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <!-- 下一首 -->
        <button class="btn btn-circle btn-ghost btn-sm hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <!-- 循环模式 -->
        <button class="btn btn-circle btn-ghost btn-sm hidden lg:flex hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <!-- 音量控制和其他按钮 -->
      <div class="flex items-center justify-end gap-3">
        <!-- 歌词按钮 -->
        <button class="btn btn-circle btn-ghost btn-sm hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <!-- 播放列表按钮 -->
        <button class="btn btn-circle btn-ghost btn-sm hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        <!-- 音量控制 -->
        <div class="group relative hidden lg:block">
          <button class="btn btn-circle btn-ghost btn-sm hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
          <!-- 音量滑块弹出框 -->
          <div class="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div class="p-3 bg-base-300 rounded-xl shadow-lg">
              <div class="w-32 h-5 flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value="90" 
                  class="range range-primary range-sm" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '../stores/playerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { currentSong, isPlaying } = storeToRefs(playerStore)
const { togglePlay } = playerStore
</script>

<style scoped>
/* 自定义滑块样式 */
.range {
  @apply cursor-pointer appearance-none bg-transparent w-full;
  height: 4px;
  padding: 0;
  margin: 0;
  margin-left: 6px;
  margin-right: 6px;
  width: calc(100% - 12px);
}

.range::-webkit-slider-thumb {
  @apply appearance-none bg-transparent cursor-pointer;
  width: 0;
  height: 0;
  border: none;
}

.range::-webkit-slider-runnable-track {
  @apply bg-base-content/20 rounded-full;
  height: 4px;
  border: none;
}

.range::-moz-range-thumb {
  @apply appearance-none bg-transparent border-none cursor-pointer;
  width: 0;
  height: 0;
  border: none;
}

.range::-moz-range-track {
  @apply bg-base-content/20 rounded-full;
  height: 4px;
  border: none;
}

.range::-ms-thumb {
  @apply appearance-none bg-transparent cursor-pointer;
  width: 0;
  height: 0;
  border: none;
}

.range::-ms-track {
  @apply bg-base-content/20 rounded-full border-transparent;
  height: 4px;
  color: transparent;
  border: none;
}

.range:focus {
  outline: none;
}

.range::-moz-focus-outer {
  border: 0;
}
</style> 