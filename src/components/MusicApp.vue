<script setup>
import { onMounted, ref } from 'vue'
import Header from './Header.vue'
import LoginModal from './LoginModal.vue'
import Album from './Album.vue'
import { usePlaylistStore } from '../stores/playlist'
import { useAlbumStore } from '../stores/album'
import { fetchProfileFromStorage, getAccessToken } from '../stores/login'

const albumStore = useAlbumStore()
const playlistStore = usePlaylistStore()
const clientId = '904da645d0e64016ab25cbfc9ce444a4'
const clientSecret = '29fc6f15441b451f91885b1b423e5230'
const accessToken = ref('')
const searchInput = ref('')
const albums = ref([])
const showModal = ref(false)
const isLoggedIn = ref(false)
const username = ref('')
const user_id = ref('')
const token = ref('')

onMounted(async () => {
  //if login
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  let localAccessToken = localStorage.getItem('access_token')
  if (localAccessToken) {
    token.value = localAccessToken
  } else if (code) {
    await getAccessToken(clientId, code)
    isLoggedIn.value = true
  }
  if (code) isLoggedIn.value = true
  const profile = await fetchProfileFromStorage()
  if (profile) {
    username.value = profile.display_name.toUpperCase()
    user_id.value = profile.id
  }

  //if not login
  await playlistStore.setAccessToken(clientId, clientSecret)
  accessToken.value = playlistStore.getAccessToken
  await playlistStore.setPlayList(accessToken.value, '37i9dQZF1DX812gZSD3Ky1')
  albums.value = playlistStore.getPlaylist
})

const search = async () => {
  const artist = await albumStore.setArtist(
    accessToken.value,
    searchInput.value
  )
  await albumStore.setAlbums(accessToken.value, artist)
  albums.value = albumStore.getAlbums
}

const getMyplayList = async () => {
  await playlistStore.getMyPlayList(token.value, user_id.value)
  albums.value = playlistStore.getPlaylist
}

const addPlaylist = () => {
  // Function to add a new playlist
  console.log('Add Playlist clicked!')
}
</script>

<template>
  <!-- Header Grid -->
  <Header :style="{ marginLeft: '256px' }">
    <template #icon> </template>
    <template #default>
      <div class="flex justify-between items-center w-full">
        <!-- Search Input aligned to the right -->
        <div class="flex justify-end items-center w-[30%]">
          <div class="relative w-full">
            <input
              type="text"
              v-model="searchInput"
              placeholder="Search for an artist"
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

        <!-- Login/Profile Button on the right -->
        <div class="flex items-center space-x-2">
          <button
            v-if="!isLoggedIn"
            @click="showModal = true"
            class="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-800 transition duration-300"
          >
            Login
          </button>
          <div
            v-else
            class="flex items-center space-x-2 border-2 rounded-full pl-4"
          >
            <span class="text-white">{{ username }}</span>
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

  <div class="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg">
    <div class="p-4 flex justify-between items-center">
      <h2 class="text-3xl font-bold">Rainlight Riot</h2>
      <button
        @click="addPlaylist"
        class="flex items-center justify-center transition-transform duration-300 hover:scale-110 rounded-full bg-slate-500 hover:bg-slate-600"
      >
        <img
          alt="Vue logo"
          class="logo cursor-pointer"
          src="../assets/plus.svg"
          width="35"
          height="35"
        />
      </button>
    </div>
    <div class="flex mt-2">
      <button
        class="hover:bg-slate-700 w-full text-start"
        @click="getMyplayList"
      >
        <div class="p-4">My Playlist</div>
      </button>
    </div>
  </div>

  <div class="ml-64">
    <Album :albums="albums" />
  </div>
  <teleport to="body">
    <LoginModal
      v-if="showModal"
      @close="showModal = false"
      @login="isLoggedIn = true"
    />
  </teleport>
</template>

<style scoped></style>
