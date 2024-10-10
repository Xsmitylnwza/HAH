<script setup>
import { usePlaylistStore } from '../stores/playlist'

const props = defineProps({
  message: {
    type: String,
    default: 'Are you sure you want to delete this item?'
  },
  playlistId: {
    type: String, // The specific playlist ID to edit
    required: false
  }
})
const playlistStore = usePlaylistStore()
const token = localStorage.getItem('access_token')
const emit = defineEmits(['confirm', 'cancel'])

const cancel = () => {
  emit('cancel')
}

const confirmDelete = async () => {
  await playlistStore.deletePlaylists(token, props.playlistId)
  emit('confirm')
}
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
      <h2 class="text-lg font-semibold mb-4">Confirm Deletion</h2>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-4">
        <button
          @click="cancel"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
