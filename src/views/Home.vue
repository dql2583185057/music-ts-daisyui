<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">音乐发现</h1>
    
    <!-- 推荐歌单 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="playlist in playlists" :key="playlist.id" 
           class="card bg-base-100 shadow-xl">
        <figure>
          <img :src="playlist.cover" alt="封面" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ playlist.title }}</h2>
          <p>{{ playlist.description }}</p>
        </div>
      </div>
    </div>

    <!-- 播放控制栏 -->
    <div class="btm-nav">
      <button class="text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
      </button>
      <button class="text-primary active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>
      <button class="text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const playlists = ref([
  {
    id: 1,
    title: '热门歌单',
    description: '最热门的音乐集合',
    cover: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    title: '新歌推荐',
    description: '最新发行的音乐',
    cover: 'https://via.placeholder.com/150'
  }
])
</script> 