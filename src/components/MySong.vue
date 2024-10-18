<script setup>
import { onMounted, ref } from 'vue'
import Header from './Header.vue'
import { fetchProfileFromStorage } from '../stores/login'
import { useRouter } from 'vue-router'
import { useSongStore } from '@/stores/song'

const songStore = useSongStore()
const router = useRouter()
const isLoggedIn = ref(false)
const username = ref('')
const songs = ref([])
const currentAudio = ref(null)
const currentSong = ref(null)

onMounted(async () => {
  const code = localStorage.getItem('code')
  let localAccessToken = localStorage.getItem('access_token')
  if (localAccessToken && code) isLoggedIn.value = true
  const profile = await fetchProfileFromStorage()
  if (profile) {
    username.value = profile.display_name
  }
  songs.value = await songStore.setAllSongs()
  console.log(songs.value)
})

const toggleAddSong = () => {
  router.push({ name: 'AddSong' })
}

const login = () => {
  router.push({ name: 'login' })
}

const playSong = (song) => {
  if (currentAudio.value) {
    currentAudio.value.pause()
  }
  console.log(song.musicLink)

  // ใช้ musicLink แทนการเล่นจากไฟล์
  currentAudio.value = new Audio(song.musicLink)

  currentAudio.value.play().catch((error) => {
    console.error('Error playing audio:', error)
  })

  currentSong.value = song
}
</script>

<template>
  <Header :style="{ marginLeft: '256px' }">
    <template #icon></template>
    <template #default>
      <div class="flex justify-between items-center w-full">
        <div class="flex justify-end items-center w-[30%]">
          <div class="relative w-full">
            <input
              type="text"
              v-model="searchInput"
              placeholder="Search for a music"
              class="w-full pl-10 pr-4 py-4 rounded-3xl border border-gray-300 text-lg shadow-md focus:outline-none"
              @input="search"
            />
            <img
              alt="Search icon"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 filter brightness-0 invert"
              src="../assets/search.svg"
              width="20"
              height="20"
            />
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            v-if="!isLoggedIn"
            @click="login"
            class="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-800 transition duration-300"
          >
            Login
          </button>
          <div
            v-else
            class="flex items-center space-x-2 border-2 rounded-full pl-4"
          >
            <span class="text-white"> {{ username }}</span>
            <img
              src="../assets/profile.jpeg"
              alt="Profile Picture"
              class="w-12 h-12 rounded-full"
            />
          </div>
        </div>
      </div>
    </template>
  </Header>

  <div
    class="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg overflow-y-auto"
  >
    <div class="p-4 flex justify-between items-center">
      <h2 class="text-3xl font-bold">Rainlight Riot</h2>
    </div>

    <button
      class="text-center bg-white text-purple-600 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition duration-300 ease-in-out mb-6"
      @click="router.push({ name: 'mysong' })"
    >
      My Song
    </button>
  </div>

  <div class="ml-64 mt-16 p-6 bg-base-200 rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-primary mb-4">My Songs</h1>
    <button @click="toggleAddSong" class="btn btn-primary">Add Song</button>

    <table class="table-auto w-full mt-6">
      <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2">Cover</th>
          <th class="px-4 py-2">Song Title</th>
          <th class="px-4 py-2">Artist</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="song in songs"
          :key="song.id"
          :class="[
            'hover:bg-gray-100 cursor-pointer',
            { 'bg-blue-100': currentSong === song }
          ]"
          @click="playSong(song)"
        >
          <td class="px-4 py-2">
            <img
              :src="song.albumCover"
              alt="Album Cover"
              class="w-16 h-16 rounded-lg"
            />
          </td>
          <td class="px-4 py-2">{{ song.musicName }}</td>
          <td class="px-4 py-2">{{ song.artist }}</td>
        </tr>
      </tbody>
    </table>

    <RouterView />
  </div>
</template>

<style scoped></style>
