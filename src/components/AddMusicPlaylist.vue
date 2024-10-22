<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePlaylistStore } from '../stores/playlist' 
import { fetchProfileFromStorage } from '../stores/login'

const props = defineProps({
  previewUrl: String,
  currentTrack: Object
})
const emit = defineEmits(['close'])
const playlistStore = usePlaylistStore()
const token = localStorage.getItem('access_token')
const user_id = ref('')
const userPlaylist = ref([])
const uri = ref('')
const trackExistsInPlaylist = ref([])
const searchQuery = ref('')

const filteredPlaylists = computed(() => {
  if (!searchQuery.value) {
    return userPlaylist.value
  }
  return userPlaylist.value.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getUserPlaylist = async () => {
  userPlaylist.value = await playlistStore.getUserPlaylist(user_id.value, token)
  for (let i = 0; i < userPlaylist.value.length; i++) {
    const playlistId = userPlaylist.value[i].id
    const exists = await checkTrackInPlaylist(playlistId, props.currentTrack.id)
    trackExistsInPlaylist.value[i] = exists
  }
}

const checkTrackInPlaylist = async (playlistId, trackId) => {
  const tracks = await playlistStore.getTrackByPlaylistsIds(playlistId, token)
  return tracks.some((track) => track.id === trackId)
}

const addTrackToPlaylist = async (playlistId, trackId, index) => {
  if (trackExistsInPlaylist.value[index]) {
    return
  }

  const tracksResponse = await playlistStore.getTrackById(token, trackId)
  if (tracksResponse && tracksResponse.length > 0) {
    const firstTrack = tracksResponse[0]
    uri.value = firstTrack.uri
  }

  try {
    await playlistStore.addNewItemToPlayList(token, playlistId, uri.value)
    await playlistStore.getTrackByPlaylistsIds(playlistId, token)
    trackExistsInPlaylist.value[index] = true
    closeModal()
  } catch (error) {
    console.error('Error adding track to playlist:', error)
  }
}

const closeModal = () => {
  emit('close')
}

onMounted(async () => {
  const profile = await fetchProfileFromStorage()
  if (profile) {
    user_id.value = profile.id
    await getUserPlaylist()
  }
})
</script>


<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
  >
    <div class="  text-white p-6 rounded-lg shadow-lg w-full max-w-md bg-gradient-to-r from-gray-800 to-gray-900">
      <div class="flex items-center justify-between">
        <p class="mr-2">Add to playlist</p>
        <img
          src="../assets/close.svg"
          alt="Close"
          class="cursor-pointer w-4 h-4"
          @click="closeModal"
        />
      </div>

      <div class="mt-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search playlist"
          class="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div
        v-for="(user, index) in filteredPlaylists"
        :key="user.id"
        class="relative flex justify-between items-center mt-2 hover:bg-slate-700 rounded-lg"
      >
        <button
          class="text-start flex-grow flex items-center"
          @click="addTrackToPlaylist(user.id, props.currentTrack.id, index)"
        >
          <div v-if="user.images && user.images[0]?.url">
            <img
              :src="user.images[0].url"
              alt="Image"
              width="70"
              height="70"
              class="p-2 object-cover rounded-lg"
            />
          </div>
          <div v-else>
            <img
              src="../assets/note.svg"
              alt="Image"
              width="70"
              height="70"
              class="p-2 filter brightness-0 invert"
            />
          </div>

          <div class="p-4">
            {{ user.name }}
          </div>
        </button>
        <div v-if="trackExistsInPlaylist[index]" class="ml-4">
          <img src="../assets/checkmark.svg" alt="Checked" class="w-5 h-5" />
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped></style>
