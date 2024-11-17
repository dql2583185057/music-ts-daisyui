import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Song {
  id: number
  title: string
  artist: string
  cover: string
  url: string
}

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref<Song | null>(null)
  const isPlaying = ref(false)
  const playlist = ref<Song[]>([])

  function playSong(song: Song) {
    currentSong.value = song
    isPlaying.value = true
  }

  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  function addToPlaylist(song: Song) {
    playlist.value.push(song)
  }

  return {
    currentSong,
    isPlaying,
    playlist,
    playSong,
    togglePlay,
    addToPlaylist
  }
}) 