<template>
  <div class="space-y-4">
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
        <tr 
          v-for="(song, index) in songs" 
          :key="song.id" 
          class="hover group"
        >
          <td class="text-base-content/50">
            <div class="flex items-center justify-center w-8 h-8 group-hover:hidden">
              {{ startIndex + index + 1 }}
            </div>
            <div class="hidden group-hover:flex items-center justify-center w-8 h-8 text-primary cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </div>
          </td>
          <td>
            <div class="flex items-center gap-3">
              <div class="relative w-10 h-10 group/cover">
                <img 
                  :src="song.al.picUrl" 
                  class="w-full h-full rounded object-cover"
                  :alt="song.name"
                  @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
                />
                <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300 rounded">
                  <div class="w-6 h-6 rounded-full bg-primary/80 flex items-center justify-center text-white transform scale-75 group-hover/cover:scale-100 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <span v-html="highlightKeyword(song.name, keyword)"></span>
                <span v-if="song.alia?.length" class="text-xs text-base-content/50">{{ song.alia.join(' ') }}</span>
              </div>
            </div>
          </td>
          <td v-html="highlightKeyword(song.ar.map(a => a.name).join('/') || '-', keyword)"></td>
          <td v-html="highlightKeyword(song.al.name || '-', keyword)"></td>
          <td class="text-base-content/50">{{ formatDuration(song.dt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Song } from '@/types/music'

const props = withDefaults(defineProps<{
  songs: Song[]
  keyword?: string
  startIndex?: number
}>(), {
  startIndex: 0
})

// 格式化时长
const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 1000 / 60)
  const seconds = Math.floor((duration / 1000) % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 高亮搜索关键词
const highlightKeyword = (text: string, keyword?: string) => {
  if (!keyword || !text) return text
  const reg = new RegExp(keyword, 'gi')
  return text.replace(reg, match => `<span class="keyword-highlight">${match}</span>`)
}
</script>

<style scoped>
:deep(.keyword-highlight) {
  color: hsl(var(--p));
}
</style> 