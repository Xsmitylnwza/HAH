<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePlaylistStore } from '@/stores/playlist'
import { fetchProfileFromStorage } from '@/login'

const props = defineProps({
  previewUrl: String,
  currentTrack: Object
})

const emit = defineEmits(['close'])
const playlistStore = usePlaylistStore()
const token = localStorage.getItem('access_token')
const userPlaylist = ref([])
const trackExistsInPlaylist = ref([])
const user_id = ref('')
const uri = ref('')
const searchQuery = ref('')

const filteredPlaylists = computed(() => {
  if (!searchQuery.value) {
    return userPlaylist.value
  }
  return userPlaylist.value.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getUserPlaylist = async () => {
  userPlaylist.value = await playlistStore.getUserPlaylist(user_id.value, token)
  for (let i = 0; i < userPlaylist.value.length; i++) {
    const playlistId = userPlaylist.value[i].id
    const existsOfTrackInPlaylist = await checkTrackInPlaylist(
      playlistId,
      props.currentTrack.trackId
    )
    const existsOfAlbum = await checkAlbumInPlaylist(
      playlistId,
      props.currentTrack.id
    )
    const existsOfTrack = await checkTrack(playlistId, props.currentTrack.id)
    trackExistsInPlaylist.value[i] =
      existsOfTrack || existsOfAlbum || existsOfTrackInPlaylist
  }
}

const checkTrackInPlaylist = async (playlistId, trackId) => {
  const tracks = await playlistStore.getTrackByPlaylistsIds(playlistId, token)
  return tracks.some((track) => track.trackId === trackId)
}
const checkTrack = async (playlistId, trackId) => {
  const tracks = await playlistStore.getTrackByPlaylistsIds(playlistId, token)
  return tracks.some((track) => track.trackId === trackId)
}
const checkAlbumInPlaylist = async (playlistId, albumId) => {
  const albums = await playlistStore.getTrackByPlaylistsIds(playlistId, token)
  return albums.some((track) => track.id === albumId)
}

const addTrackToPlaylist = async (playlistId, trackId, index) => {
  if (trackExistsInPlaylist.value[index]) {
    return
  }
  if (props.currentTrack.uri.startsWith('spotify:track')) {
    uri.value = props.currentTrack.uri
  } else if (props.currentTrack.uri.startsWith('spotify:album')) {
    const tracksResponse = await playlistStore.getTrackById(token, trackId)
    if (tracksResponse && tracksResponse.length > 0) {
      const firstTrack = tracksResponse[0]
      uri.value = firstTrack.uri
    }
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

onMounted(async () => {
  const profile = await fetchProfileFromStorage()
  if (profile) {
    user_id.value = profile.id
    await getUserPlaylist()
  }
})

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
  >
    <div
      class="text-white p-6 rounded-lg shadow-lg w-full max-w-md bg-gradient-to-r from-gray-800 to-gray-900"
    >
      <div class="flex items-center justify-between">
        <p class="mr-2 text-xl">Add to playlist</p>
        <img
          src="/images/close.svg"
          alt="Close"
          class="cursor-pointer w-4 h-4 filter brightness-4 invert"
          @click="closeModal"
        />
      </div>

      <div class="mt-4 relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search playlist"
          class="w-full p-2 pl-10 border border-gray-300 rounded-lg"
        />
        <img
          alt="Search icon"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 filter brightness-0 invert"
          src="/images/search.svg"
          width="20"
          height="20"
        />
      </div>
      <div class="mt-4 max-h-64 overflow-y-auto">
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
                src="/images/note.svg"
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
            <img
              src="/images/checkmark.svg"
              alt="Checked"
              class="w-5 h-5 filter brightness-4 invert mr-2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
