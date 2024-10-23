<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSongStore } from '@/stores/song'

const router = useRouter()
const songStore = useSongStore()
const song = ref({})
const props = defineProps({
  songId: { type: String, Required: true }
})
const emit = defineEmits(['closeModal'])

const form = reactive({
  albumCover: null,
  artist: '',
  musicName: '',
  musicDescription: '',
  musicLink: null
})

onMounted(async () => {
  await fetchSong()
  loadSongData()
})

const sendCloseModal = () => {
  emit('closeModal', false)
  router.push('/mysong')
}

const loadSongData = () => {
  form.albumCover = song.value.albumCover
  form.artist = song.value.artist
  form.musicName = song.value.musicName
  form.musicDescription = song.value.musicDescription
  form.musicLink = song.value.musicLink
}

const handleCoverSelect = (files) => {
  if (files.length > 0) {
    form.albumCover = URL.createObjectURL(files[0])
  }
}

const handleSubmit = async () => {
  await songStore.updateSong(props.songId, form)
  emit('closeModal', false)
}

const fetchSong = async () => {
  try {
    const result = await songStore.getSongById(props.songId)
    song.value = result
  } catch (error) {
    console.error('Error fetching song:', error.message)
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
            v-if="form.albumCover"
            :src="form.albumCover"
            alt="Album Cover"
            class="object-cover w-full h-full rounded-lg border border-gray-300"
          />
          <div
            v-else
            class="bg-gray-100 flex justify-center items-center w-full h-full rounded-lg border border-gray-300"
          >
            <span class="text-white">Choose Cover</span>
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
        <h2 class="text-2xl font-bold text-white">Edit Music</h2>

        <div>
          <label class="text-white">Music name</label>
          <input
            v-model="form.musicName"
            type="text"
            class="w-full p-3 mb-4 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-800 text-white"
            placeholder="Music name"
          />
        </div>

        <div>
          <label class="text-white">Artist name</label>
          <input
            v-model="form.artist"
            type="text"
            class="w-full p-3 mb-4 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-800 text-white"
            placeholder="Artist name"
          />
        </div>

        <div>
          <label class="text-white">Music Description</label>
          <input
            v-model="form.musicDescription"
            type="text"
            class="w-full p-3 mb-4 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-800 text-white"
            placeholder="Music Description"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <button
            @click="handleSubmit"
            class="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Save
          </button>

          <button
            @click="sendCloseModal"
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
