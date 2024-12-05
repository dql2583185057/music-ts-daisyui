<template>
  <div class="container mx-auto p-4">
    <!-- 歌单信息 -->
    <div class="flex gap-6 mb-8">
      <img 
        :src="playlist?.coverImgUrl || 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'" 
        class="w-48 h-48 rounded-lg object-cover"
      />
      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-4">{{ playlist?.name }}</h1>
        <div class="mb-2">
          <span class="font-medium">创建者：</span>
          <span>{{ playlist?.creator?.nickname }}</span>
        </div>
        <div class="mb-2">
          <span class="font-medium">歌曲数：</span>
          <span>{{ playlist?.trackCount || 0 }} 首</span>
        </div>
        <p class="text-base-content/70">{{ playlist?.description || '暂无简介' }}</p>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="overflow-x-auto">
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
                  :src="song.al.picUrl"
                  class="w-10 h-10 rounded object-cover"
                  :alt="song.name"
                  @error="e => (e.target as HTMLImageElement).src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'"
                />
                <span>{{ song.name }}</span>
              </div>
            </td>
            <td>{{ song.ar.map(a => a.name).join('/') }}</td>
            <td>{{ song.al.name }}</td>
            <td class="text-base-content/50">{{ formatDuration(song.dt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Song, Playlist } from '@/types/music'

const route = useRoute()
const playlist = ref<Playlist>()
const songs = ref<Song[]>([])

// 格式化时长
const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 1000 / 60)
  const seconds = Math.floor((duration / 1000) % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

onMounted(async () => {
  // 从API获取歌单详情
  const id = Number(route.params.id)
  try {
    // TODO: 调用API获取歌单详情
    // const res = await playlistService.getDetail(id)
    // playlist.value = res.playlist
    // songs.value = res.songs
  } catch (error) {
    console.error('获取歌单详情失败:', error)
  }
})
</script> 