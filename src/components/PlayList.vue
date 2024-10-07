<script setup>
import { usePlaylistStore } from '../stores/playlist'
import { ref } from 'vue'
const props = defineProps({
  playlists: Array
})

const playlistStore = usePlaylistStore()
let accessToken = localStorage.getItem('access_token')

let previewUrl = ref('')
const music = ref('')

const click = async (playlist) => {
  const track = await playlistStore.getAlbumSpotifyTrack(
    accessToken,
    playlist.id
  )
  console.log(track)
  previewUrl.value = track[0].preview_url
  if (music.value) {
    music.value.load()
    music.value.play()
  }
}
</script>

<template>
  <div
    v-if="playlists.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-4 p-4"
  >
    <button
      v-for="playlist in playlists"
      :key="playlist.id"
      class="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-200 hover:shadow-xl hover:-translate-y-1"
      @click="click(playlist)"
    >
      <img
        :src="playlist.images[0].url"
        alt="Album Cover"
        class="w-full h-64 object-cover"
      />
      <div class="p-4">
        <h3
          class="text-black text-lg font-semibold hover:text-violet-600 transition-colors duration-200"
        >
          {{ playlist.name }}
        </h3>
        <p class="text-gray-500">{{ playlist.artists[0].name }}</p>
      </div>
    </button>
  </div>

  <div v-else>
    <p class="text-center text-gray-500">No playlists found.</p>
  </div>

  <div v-if="previewUrl" class="mt-4">
    <audio controls class="hidden" ref="music">
      <source :src="previewUrl" type="audio/mp3" />
    </audio>
  </div>
</template>

<style scoped></style>
