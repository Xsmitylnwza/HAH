<script setup>
import { onMounted, ref } from 'vue'
import Header from './Header.vue'
import { fetchProfileFromStorage } from '../stores/login'
import { useRouter } from 'vue-router'
import { useSongStore } from '@/stores/song'
import EditMySong from './EditMySong.vue'

// Importing the default note image
import noteImage from '../assets/note.svg'

const songStore = useSongStore()
const router = useRouter()
const isLoggedIn = ref(false)
const username = ref('')
const selectSongId = ref('')
const currentAudio = ref(null)
const currentSong = ref(null)
const showEdit = ref(false)

onMounted(async () => {
  const code = localStorage.getItem('code')
  let localAccessToken = localStorage.getItem('access_token')
  if (localAccessToken && code) isLoggedIn.value = true
  const profile = await fetchProfileFromStorage()
  if (profile) {
    username.value = profile.display_name
  }
  await songStore.setAllSongs()
})

const toggleAddSong = () => {
  router.push({ name: 'AddSong' })
}

const closeEditModal = (value) => {
  showEdit.value = value
}

const login = () => {
  router.push({ name: 'login' })
}

const playSong = (song) => {
  if (currentAudio.value) {
    currentAudio.value.pause()
  }
  console.log(song.musicLink)

  // Play music from musicLink
  currentAudio.value = new Audio(song.musicLink)

  currentAudio.value.play().catch((error) => {
    console.error('Error playing audio:', error)
  })

  currentSong.value = song
}

const editSongData = (id) => {
  showEdit.value = true
  selectSongId.value = id
}

const imageError = (event) => {
  event.target.src = noteImage
  event.target.classList.add(
    'border-2',
    'w-14',
    'h-14',
    'rounded-lg',
    'filter',
    'brightness-0',
    'invert'
  )
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
              class="w-full pl-10 pr-4 py-4 rounded-3xl border border-gray-300 text-lg shadow-md focus:outline-none focus:ring focus:ring-blue-300"
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

    <div class="flex justify-start mb-6 ml-4">
      <button
        class="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold w-[45%] p-4 rounded-full shadow-lg hover:scale-105 transition duration-300 ease-in-out"
        @click="router.push({ name: 'mysong' })"
      >
        My Song
      </button>
    </div>
  </div>

  <div class="ml-64 mt-16 p-6 bg-base-200 rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-primary mb-4">My Songs</h1>
    <button @click="toggleAddSong" class="btn btn-primary">Add Song</button>

    <table
      class="table-auto w-full mt-6 border border-gray-300 rounded-lg overflow-hidden"
    >
      <thead class="bg-gray-200">
        <tr>
          <th class="px-4 py-2 text-center text-black">Cover</th>
          <th class="px-4 py-2 text-center text-black">Song Title</th>
          <th class="px-4 py-2 text-center text-black">Artist</th>
          <th class="px-4 py-2 text-center text-black">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="song in songStore.songs"
          :key="song.id"
          class="hover:bg-gray-800 transition duration-300 cursor-pointer"
          @click="playSong(song)"
        >
          <td class="px-4 py-2 flex justify-center">
            <div v-if="song.albumCover">
              <img
                :src="song.albumCover"
                alt="Album Cover"
                class="w-16 h-16 p-2 object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                @error="imageError"
              />
            </div>
            <div v-else class="border-2 border-gray-500 rounded-2xl">
              <img
                src="../assets/note.svg"
                alt="Default Cover"
                class="w-16 h-16 rounded-lg filter brightness-0 invert"
              />
            </div>
          </td>
          <td class="px-4 py-2 text-center text-white">{{ song.musicName }}</td>
          <td class="px-4 py-2 text-center text-white">{{ song.artist }}</td>
          <td class="px-4 py-2 text-center">
            <button
              class="btn btn-secondary"
              @click.stop="editSongData(song.id)"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <teleport to="body">
      <EditMySong
        v-if="showEdit"
        :songId="selectSongId"
        @closeModal="closeEditModal"
      />
    </teleport>
    <RouterView />
  </div>
</template>
