<script setup>
import { ref } from 'vue'
import MusicPlayer from './MusicPlayer.vue'

const props = defineProps({
  tracks: Array,
  album: Object
})

let previewUrl = ref('')
let currentTrack = ref(null)

const click = (track) => {
  previewUrl.value = track.preview_url // กำหนด URL ของเพลงที่ถูกคลิก
  currentTrack.value = track // กำหนด track ที่ถูกเลือก
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center mb-4">
      <img
        :src="album.images[0].url"
        alt="Album Cover"
        class="w-[20%] h-[20%] object-cover"
      />
      <div class="ml-6">
        <h2 class="text-3xl font-bold">{{ album.name }}</h2>
        <p class="text-gray-600">
          {{ album.artists[0].name }} - {{ album.release_date }}
        </p>
      </div>
    </div>
    <div class="overflow-hidden shadow rounded-lg">
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 bg-gray-900 text-left text-white">#</th>
            <th class="py-2 px-4 bg-gray-900 text-left text-white">Title</th>
            <th class="py-2 px-4 bg-gray-900 text-left text-white">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="track in tracks"
            :key="track.id"
            @click="click(track)"
            class="bg-gray-800 hover:bg-gray-900 transition-colors duration-200 cursor-pointer"
          >
            <td class="py-2 px-4 text-white">{{ track.track_number }}</td>
            <td class="py-2 px-4 text-white">{{ track.name }}</td>
            <td class="py-2 px-4 text-white">
              {{ (track.duration_ms / 60000).toFixed(2) }} min
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <MusicPlayer
      v-if="currentTrack"
      :preview-url="previewUrl"
      :current-track="currentTrack"
      :album="album"
    />
  </div>
</template>
