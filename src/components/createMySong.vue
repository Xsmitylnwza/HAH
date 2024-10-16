<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const songFile = ref(null)
const musicDescription = ref('')
const singerName = ref('')
const songName = ref('')

// Function to handle file upload
const handleFileUpload = (event) => {
  songFile.value = event.target.files[0]
}

// Function to add a song
const addSong = async () => {
  const newItem = {
    songName: songName.value,
    description: musicDescription.value,
    singer: singerName.value,
    file: songFile.value ? songFile.value.name : '', // Send file name if exists
  }

  try {
    const addedItem = await addItem('/api/add-song', newItem) // Call API to add song
    console.log('Added song:', addedItem)
    // Close modal after successfully adding song
    showModal.value = false
  } catch (error) {
    console.error('Error adding song:', error)
  }
}

// Fetch function to add a song to backend
async function addItem(url, newItem) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
    const addedItem = await res.json()
    return addedItem
  } catch (error) {
    console.error(`error: ${error}`)
    throw new Error(error)
  }
}
</script>

<template>
  <div>
    <!-- Button to open modal -->
    <button @click="showModal = true" class="block text-white text-lg font-semibold bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-center">
      Add Song
    </button>

    <!-- Modal for adding a song -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-2xl font-semibold mb-4">Create My Song</h2>

        <!-- File upload field -->
        <div class="mb-4">
          <label class="block font-semibold mb-1">Upload Song</label>
          <input type="file" accept="audio/*" @change="handleFileUpload" class="border rounded-lg px-3 py-2 w-full" />
        </div>

        <!-- Song name input -->
        <div class="mb-4">
          <label class="block font-semibold mb-1">Song Name</label>
          <input v-model="songName" type="text" placeholder="Enter song name" class="border rounded-lg px-3 py-2 w-full" />
        </div>

        <!-- Singer name input -->
        <div class="mb-4">
          <label class="block font-semibold mb-1">Singer Name</label>
          <input v-model="singerName" type="text" placeholder="Enter singer name" class="border rounded-lg px-3 py-2 w-full" />
        </div>

        <!-- Music description input -->
        <div class="mb-4">
          <label class="block font-semibold mb-1">Music Description</label>
          <textarea v-model="musicDescription" placeholder="Enter music description" class="border rounded-lg px-3 py-2 w-full"></textarea>
        </div>

        <!-- Add and Cancel buttons -->
        <div class="flex justify-end space-x-2">
          <button @click="showModal = false" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
          <button @click="addSong" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>
