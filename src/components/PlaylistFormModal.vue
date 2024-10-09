<script setup>
import { usePlaylistStore } from '../stores/playlist'
import { ref, onMounted, watch } from 'vue'
import { fetchProfileFromStorage } from '../stores/login'

const playlistStore = usePlaylistStore()
const user_id = ref('')

const props = defineProps({
  mode: {
    type: String,
    required: true
  },
  playlist: {
    type: String,
    required: false
  }
})

const token = localStorage.getItem('access_token')

// Playlist fields for creating/editing
const newPlaylistName = ref('')
const playlistDescription = ref('')
const playlistsPublic = ref(false)

const newPlayList = ref({
  name: '',
  description: '',
  public: false
})

// Fetch user ID and set playlist values if editing
onMounted(async () => {
  const profile = await fetchProfileFromStorage()
  if (profile) {
    user_id.value = profile.id
  }
})

const createOrEditPlaylist = () => {
  if (newPlaylistName.value) {
    newPlayList.value = {
      name: newPlaylistName.value,
      description: playlistDescription.value,
      public: playlistsPublic.value
    }
    if (props.mode === 'edit') {
      playlistStore.updatePlaylist(token, props.playlist.id, newPlayList.value)
    } else {
      playlistStore.createPlaylist(token, user_id.value, newPlayList.value)
    }

    // Reset fields after creating/editing
    newPlaylistName.value = ''
    playlistDescription.value = ''
    playlistsPublic.value = false
    emit('create')
    closeModal()
  }
}

const closeModal = () => {
  emit('close')
}

const emit = defineEmits(['create', 'close'])
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
  >
    <div class="bg-white text-black p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">
        {{ mode === 'create' ? 'Create Playlist' : 'Edit Playlist' }}
      </h2>

      <input
        v-model="newPlaylistName"
        type="text"
        class="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        placeholder="Playlist Name"
      />

      <input
        v-model="playlistDescription"
        type="text"
        class="w-full p-2 mb-4 border border-gray-300 rounded text-black"
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
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
