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
const currentTime = ref(0);
const audioDuration = ref(0);
const isPlaying = ref(false);

const click = async (track) => {
  try {
    const tracks = await playlistStore.getTrack(accessToken, track.id);
    if (tracks && tracks.length > 0) {
      const firstTrack = tracks[0]; 

      if (firstTrack.preview_url) {
        previewUrl.value = firstTrack.preview_url;
        currentTrack.value = track; 
      } else {
        resetPlayer();
      }
    } else {
      resetPlayer(); 
    }
  } catch (error) {
    console.error('Error fetching track:', error);
    resetPlayer(); 
  }
};


const resetPlayer = () => {
  previewUrl.value = null;
  currentTrack.value = null;
  currentTime.value = 0;
  audioDuration.value = 0;
  isPlaying.value = false;
};



</script>

<template>
  <div
    v-if="tracks.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-4 p-4"
  >
    <button
      v-for="track in tracks"
      :key="track.id"
      class="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-200 hover:shadow-xl hover:-translate-y-1"
      @click="click(track)"
    >
      <img
        :src="track.images[0].url"
        alt="Album Cover"
        class="w-full h-64 object-cover"
      />
      <div class="p-4">
        <h3
          class="text-black text-lg font-semibold hover:text-violet-600 transition-colors duration-200"
        >
          {{ track.name }}
        </h3>
        <p class="text-gray-500">{{ track.artists[0].name }}</p>
      </div>
    </button>
  </div>

  <div v-else>
    <p class="text-center text-gray-500">No playlists found.</p>
  </div>

  <MusicPlayer v-if="currentTrack" :previewUrl="previewUrl" :currentTrack="currentTrack" />
</template>

<style scoped>

</style>
