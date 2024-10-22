<script setup>
import { usePlaylistStore } from '../stores/playlist'
import { ref } from 'vue'
import MusicPlayer from './MusicPlayer.vue'

const props = defineProps({
  tracks: Array
})

const playlistStore = usePlaylistStore()
let accessToken = localStorage.getItem('access_token')
const previewUrl = ref('')
const currentTrack = ref(null)
const currentTime = ref(0)
const audioDuration = ref(0)
const isPlaying = ref(false)
const trackId = ref('')

const click = async (track) => {
  try {
    const tracks = await playlistStore.getTrackById(accessToken, track.id)
    if (tracks && tracks.length > 0) {
      const firstTrack = tracks[0]
      if (firstTrack.preview_url) {
        previewUrl.value = firstTrack.preview_url
        trackId.value = firstTrack.id
        currentTrack.value = track
      } else {
        resetPlayer()
      }
    } else {
      resetPlayer()
    }
  } catch (error) {
    console.error('Error fetching track:', error)
    resetPlayer()
  }
}

const resetPlayer = () => {
  previewUrl.value = null
  currentTrack.value = null
  currentTime.value = 0
  audioDuration.value = 0
  isPlaying.value = false
}
</script>

<template>
  <div
    v-if="tracks.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-4 p-4"
  >
    <div
      v-for="track in tracks"
      :key="track.id"
      class="relative bg-[#1e293b] rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="click(track)"
    >
      <img
        :src="track.images[0].url"
        alt="Album Cover"
        class="w-full h-64 object-cover rounded-t-lg"
      />

      <!-- Song Info -->
      <div class="p-4">
        <h3
          class="text-white text-lg font-semibold hover:text-violet-400 transition-colors duration-200"
        >
          {{ track.name }}
        </h3>
        <p class="text-gray-400">{{ track.artists[0].name }}</p>
      </div>
    </div>
  </div>

  <!-- Music Player -->
  <MusicPlayer
    v-if="currentTrack"
    :previewUrl="previewUrl"
    :currentTrack="currentTrack"
  />
</template>

<style scoped></style>
