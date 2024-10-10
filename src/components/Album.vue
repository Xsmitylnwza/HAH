<script setup>
import { ref } from 'vue'
import { usePlaylistStore } from '../stores/playlist'
import TrackList from './TrackList.vue' // Import TrackList component

const props = defineProps({
  albums: Array
})

const playlistStore = usePlaylistStore()
let accessToken = localStorage.getItem('access_token')

const selectedAlbum = ref('')
const tracks = ref([])

const click = async (album) => {
  selectedAlbum.value = album
  const trackData = await playlistStore.getTrack(accessToken, album.id)
  tracks.value = trackData
}
const goBack = () => {
  selectedAlbum.value = ''
}
</script>

<template>
  <div
    v-if="!selectedAlbum"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-4 p-4"
  >
    <button
      v-for="album in albums"
      :key="album.id"
      class="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-200 hover:shadow-xl hover:-translate-y-1"
      @click="click(album)"
    >
      <img
        :src="album.images[0].url"
        alt="Album Cover"
        class="w-full h-64 object-cover"
      />
      <div class="p-4">
        <h3
          class="text-black text-lg font-semibold hover:text-violet-600 transition-colors duration-200"
        >
          {{ album.name }}
        </h3>
        <p class="text-gray-500">{{ album.artists[0].name }}</p>
      </div>
    </button>
  </div>

  <!-- Render the TrackList component and the Back button only if an album is selected -->
  <div v-if="selectedAlbum">
    <!-- Back button aligned to the right -->
    <div class="flex justify-end mb-4">
      <button
        @click="goBack"
        class="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors duration-200"
      >
        Back to Albums
      </button>
    </div>

    <!-- TrackList component -->
    <TrackList :tracks="tracks" :album="selectedAlbum" />
  </div>
</template>
