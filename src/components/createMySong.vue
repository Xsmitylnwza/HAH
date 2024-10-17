<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { addItem } from '../lib/fetchUtils'
// import { mysongStore } from '@/stores/Mysong'
import { fetchProfileFromStorage } from '../stores/login'

const router = useRouter()
const user_id = ref('')



const url = 'http://localhost:5174'


const musicFile = ref(null)
const musicDescription = ref('')
const singerName = ref('')



const addSong = async () => {
    const songData = {
        File: musicFile.value,
        Singer: singerName.value,
        description: musicDescription.value
    };

    await addItem('http://localhost:5001/songs', songData)

}

// Handling file selection using ref instead of event
const handleFileSelect = (files) => {
    musicFile.value = files
onMounted(async () => {
  const profile = await fetchProfileFromStorage()
  if (profile) {
    user_id.value = profile.id
  }
})

const createSong = async () => {
  if (musicFile.value && singerName.value) {
    const formData = new FormData()
    formData.append('file', musicFile.value)
    formData.append('description', musicDescription.value)
    formData.append('singer', singerName.value)

    try {
      await addItem(user_id.value, formData)
      clearForm()
      closeModal()
    } catch (error) {
      console.error('Error adding song:', error)
    }
  } else {
    alert('Please provide a music file and singer name.')
  }
}

// Clear form inputs
const clearForm = () => {
    musicFile.value = null
    musicDescription.value = ''
    singerName.value = ''
}

const closeModal = () => {

    emit('close') // Emit close event
    router.push({ name: 'music' }) // Navigate to music page
}

// Define emits
const emit = defineEmits(['close'])



</script>

<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div class="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-xl font-bold mb-4">Add New Song</h2>

            <!-- Input for file upload -->
            <input ref="musicFile" type="file" accept="audio/*" class="w-full p-2 mb-4 border border-gray-300 rounded"
                @change="handleFileSelect($event.target.files)" />

            <!-- Input for singer name -->
            <input v-model="singerName" type="text" class="w-full p-2 mb-4 border border-gray-300 rounded"
                placeholder="Singer Name" />

            <!-- Input for music description -->
            <input v-model="musicDescription" type="text" class="w-full p-2 mb-4 border border-gray-300 rounded"
                placeholder="Music Description" />

            <div class="flex justify-end">
                <button @click="addSong" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add
                </button>
                <button @click="closeModal" class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Cancel
                </button>
            </div>
        </div>

  router.push({ name: 'mysong' })
}

const handleFileSelect = (files) => {
  if (files && files.length > 0) {
    musicFile.value = files[0]
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
  >
    <div class="bg-white text-black p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Add New Song</h2>

      <input
        ref="musicFile"
        type="file"
        accept="audio/*"
        class="w-full p-2 mb-4 border border-gray-300 rounded"
        @change="handleFileSelect($event.target.files)"
      />

      <!-- Input for singer name -->
      <input
        v-model="singerName"
        type="text"
        class="w-full p-2 mb-4 border border-gray-300 rounded"
        placeholder="Singer Name"
      />

      <input
        v-model="musicDescription"
        type="text"
        class="w-full p-2 mb-4 border border-gray-300 rounded"
        placeholder="Music Description"
      />

      <div class="flex justify-end">
        <button
          @click="createSong"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
        <button
          @click="closeModal"
          class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
</template>

<style scoped></style>
