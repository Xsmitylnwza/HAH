<script setup>
import { usePlaylistStore } from '@/stores/playlist'

const props = defineProps({
  message: {
    type: String,
    default: 'Are you sure you want to delete this item?'
  },
  playlistId: {
    type: String,
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
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75"
  >
    <div
      class="rounded-lg p-6 max-w-md w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white"
    >
      <h2 class="text-lg font-semibold mb-4">Confirm Deletion</h2>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-4">
        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
        <button
          @click="cancel"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
