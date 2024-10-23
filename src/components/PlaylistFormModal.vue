<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePlaylistStore } from '@/stores/playlist'
import { fetchProfileFromStorage } from '@/login'

const token = localStorage.getItem('access_token')
const route = useRoute()
const router = useRouter()
const playlistStore = usePlaylistStore()
const playlist = ref([])
const user_id = ref('')
const newPlaylistName = ref('')
const playlistDescription = ref('')
const playlistsPublic = ref(false)
const mode = route.name === 'create' ? 'create' : 'edit'
const newPlayList = ref({
  name: '',
  description: '',
  public: false
})

onMounted(async () => {
  const profile = await fetchProfileFromStorage()
  if (profile) {
    user_id.value = profile.id
  }
  playlist.value = await playlistStore.getUserPlaylist(user_id.value, token)
  if (mode === 'edit' && playlist.value.length > 0) {
    const selectedPlaylist = playlist.value.find(
      (p) => p.id === route.params.id
    )
    if (selectedPlaylist) {
      newPlaylistName.value = selectedPlaylist.name
      playlistDescription.value = selectedPlaylist.description
      playlistsPublic.value = selectedPlaylist.public
    }
  }
})

const createOrEditPlaylist = async () => {
  if (newPlaylistName.value) {
    newPlayList.value = {
      name: newPlaylistName.value,
      description: playlistDescription.value,
      public: playlistsPublic.value
    }

    if (mode === 'edit') {
      await playlistStore.updatePlaylist(
        token,
        route.params.id,
        newPlayList.value
      )
    } else {
      await playlistStore.createNewPlaylist(
        token,
        user_id.value,
        newPlayList.value
      )
    }
    newPlaylistName.value = ''
    playlistDescription.value = ''
    playlistsPublic.value = false
    closeModal()
  }
}

const closeModal = async () => {
  router.push({ name: 'music' })
}
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
  >
    <div
      class="p-6 rounded-lg shadow-lg w-96 bg-gradient-to-r from-gray-800 to-gray-900 text-white"
    >
      <h2 class="text-xl font-bold mb-4">
        {{ mode === 'create' ? 'Create Playlist' : 'Edit Playlist' }}
      </h2>

      <input
        v-model="newPlaylistName"
        type="text"
        class="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-700 text-white"
        placeholder="Playlist Name"
      />

      <input
        v-model="playlistDescription"
        type="text"
        class="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-700 text-white"
        placeholder="Playlist Description"
      />

      <label class="flex items-center mb-4">
        <span class="mr-2">Public Playlist</span>
        <div
          class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
        >
          <input v-model="playlistsPublic" type="checkbox" class="toggle" />
        </div>
      </label>

      <div class="flex justify-end">
        <button
          @click="createOrEditPlaylist"
          class="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          {{ mode === 'create' ? 'Create' : 'Save' }}
        </button>
        <button
          @click="closeModal"
          class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
