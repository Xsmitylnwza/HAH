<template>
  <div class="modal-overlay">
    <div class="modal">
      <button class="close" @click="$emit('close')">X</button>
      <h2>Add a New Song</h2>
      <form @submit.prevent="addSong">
        <div>
          <label for="songTitle">Song Title:</label>
          <input type="text" v-model="songTitle" required />
        </div>
        <div>
          <label for="artistName">Artist Name:</label>
          <input type="text" v-model="artistName" required />
        </div>
        <div>
          <label for="songLink">Song Link:</label>
          <input type="url" v-model="songLink" required />
        </div>
        <button type="submit">Add Song</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { usePlaylistStore } from '../stores/playlist'

const emit = defineEmits()
const songTitle = ref('')
const artistName = ref('')
const songLink = ref('')
const playlistStore = usePlaylistStore()

const addSong = async () => {
  await playlistStore.addSong({ title: songTitle.value, artist: artistName.value, link: songLink.value })
  songTitle.value = ''
  artistName.value = ''
  songLink.value = ''
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
.close {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
