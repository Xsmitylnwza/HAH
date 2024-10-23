<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSongStore } from '@/stores/song'
import { fetchProfileFromStorage } from '@/login'

const router = useRouter()
const songStore = useSongStore()
const user_id = ref('')

const newSong = ref({
  albumCover: null,
  artist: '',
  musicName: '',
  musicDescription: '',
  musicLink: ''
})

onMounted(async () => {
  const profile = await fetchProfileFromStorage()
  if (profile) {
    user_id.value = profile.id
  }
})

const createSong = async () => {
  await songStore.addNewSong(newSong.value)
  closeModal()
}

const closeModal = () => {
  router.push({ name: 'mysong' })
}

const handleCoverSelect = (files) => {
  if (files.length > 0) {
    const cover = URL.createObjectURL(files[0])
    newSong.value.albumCover = cover
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
  >
    <div
      class="bg-slate-900 text-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex space-x-6"
    >
      <div class="w-1/2">
        <label class="block mb-2 font-bold text-white">Music cover</label>
        <div class="aspect-w-1 aspect-h-1">
          <img
            v-if="newSong.albumCover"
            :src="newSong.albumCover"
            alt="Album Cover"
            class="object-cover w-full h-full rounded-lg border border-gray-300"
          />
          <div
            v-else
            class="bg-gray-100 flex justify-center items-center w-full h-full rounded-lg border border-gray-300"
          >
            <span class="text-gray-600">Choose Cover</span>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          class="mt-4 block w-full text-sm text-white bg-slate-600 border border-gray-500 rounded-lg cursor-pointer"
          @change="handleCoverSelect($event.target.files)"
        />
      </div>

      <div class="w-1/2 space-y-4">
        <h2 class="text-2xl font-bold mb-2 text-white">Add Music</h2>

        <div>
          <label class="text-white">Music name</label>
          <input
            v-model="newSong.musicName"
            type="text"
            class="w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-800 text-white"
            placeholder="Music name"
          />
        </div>

        <div>
          <label class="text-white">Artist Name</label>
          <input
            v-model="newSong.artist"
            type="text"
            class="w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-800 text-white"
            placeholder="Artist name"
          />
        </div>

        <div>
          <label class="text-white">Music Description</label>
          <input
            v-model="newSong.musicDescription"
            type="text"
            class="w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-800 text-white"
            placeholder="Music Description"
          />
        </div>

        <div>
          <label class="text-white">Music Link</label>
          <input
            v-model="newSong.musicLink"
            type="text"
            class="w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-800 text-white"
            placeholder="Music Link"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <button
            @click="createSong"
            class="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Add
          </button>

          <button
            @click="closeModal"
            class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
