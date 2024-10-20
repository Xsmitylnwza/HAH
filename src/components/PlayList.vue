<script setup>
import { usePlaylistStore } from '../stores/playlist'
import { ref, watch, onMounted } from 'vue'
import MusicPlayer from './MusicPlayer.vue'
import { useRoute } from 'vue-router'
import DeleteModal from './DeleteModal.vue'

const playlistStore = usePlaylistStore()
let accessToken = localStorage.getItem('access_token')

const route = useRoute()
const previewUrl = ref('')
const currentTrack = ref(null)
const currentTime = ref(0)
const audioDuration = ref(0)
const isPlaying = ref(false)
const showDropdown = ref('')
const showDelete = ref(false)
const uri = ref([])
const trackId = ref('')
const tracks = ref([])
const trackToDelete = ref('')
const trackName = ref('')

onMounted(async () => {
  tracks.value = await playlistStore.getTrackByPlaylistsIds(
    route.params.playlistid,
    accessToken
  )
})
watch(
  () => route.params.playlistid,
  async (newPlaylistId) => {
    tracks.value = await playlistStore.getTrackByPlaylistsIds(
      newPlaylistId,
      accessToken
    )
  }
)

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

const confirmDelete = async () => {
  if (trackToDelete.value) {
    const tracksResponse = await playlistStore.getTrackById(
      accessToken,
      trackToDelete.value.id
    )
    if (tracksResponse.length > 1) {
      uri.value = tracksResponse.map((t) => t.uri)
    } else if (tracksResponse && tracksResponse.length > 0) {
      const firstTrack = tracksResponse[0]
      uri.value = firstTrack.uri
    } else {
      resetPlayer()
      return
    }

    try {
      await playlistStore.deleteSongFromPlayList(
        accessToken,
        route.params.playlistid,
        uri.value
      )
      tracks.value = tracks.value.filter((t) => t.id !== trackToDelete.value.id)
    } catch (error) {
      console.error(error)
    }
  }
  closeDeleteModal()
}

const openDeleteModal = (track) => {
  trackName.value = track.name
  trackToDelete.value = track
  showDelete.value = true
}

const closeDeleteModal = () => {
  showDelete.value = false
  trackToDelete.value = null
}

const resetPlayer = () => {
  previewUrl.value = null
  currentTrack.value = null
  currentTime.value = 0
  audioDuration.value = 0
  isPlaying.value = false
}

const toggleDropdown = (trackId) => {
  showDropdown.value = showDropdown.value === trackId ? null : trackId
}
</script>

<template>
  <div
    v-if="tracks.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-4 p-4 ml-64"
  >
    <div
      v-for="track in tracks"
      :key="track.id"
      class="relative bg-[#1e293b] rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
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

      <!-- Dropdown Button -->
      <button
        class="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
        @click.stop="toggleDropdown(track.id)"
      >
        <img
          alt="Options"
          class="w-5 h-5 filter brightness-0 invert"
          src="../assets/options.svg"
        />
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showDropdown === track.id"
        class="absolute right-4 top-12 mt-2 w-32 bg-white text-black shadow-lg rounded-lg z-20"
      >
        <button
          class="block w-full px-4 py-2 hover:bg-gray-200 text-left rounded-lg"
          @click="openDeleteModal(track)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>

  <div v-else>
    <p class="text-center text-gray-500">No playlists found.</p>
  </div>

  <!-- Music Player -->
  <teleport to="body">
    <MusicPlayer
      v-if="currentTrack"
      :previewUrl="previewUrl"
      :currentTrack="currentTrack"
    />
  </teleport>

  <!-- Delete Modal -->
  <teleport to="body">
    <DeleteModal
      v-if="showDelete"
      :message="`Are you sure you want to delete ${trackName}?`"
      @confirm="confirmDelete"
      @cancel="showDelete = false"
    />
  </teleport>
</template>

<style scoped></style>
