<script setup>
import { onMounted, ref } from 'vue'
import Header from './Header.vue'
import LoginModal from './LoginModal.vue'
import Album from './Album.vue'
import { usePlaylistStore } from '../stores/playlist'
import { useAlbumStore } from '../stores/album'
import { fetchProfile, getAccessToken } from '../stores/login'

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
const showSidebar = ref(false)

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  if (code) isLoggedIn.value = true
  await playlistStore.setAccessToken(clientId, clientSecret)
  accessToken.value = playlistStore.getAccessToken
  const token = await getAccessToken(clientId, code)
  const profile = await fetchProfile(token)
  username.value = profile.name

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

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const addPlaylist = () => {
  // Function to add a new playlist
  console.log('Add Playlist clicked!')
}
</script>

<template>
  <!-- Header Grid -->
  <Header :style="{ marginLeft: showSidebar ? '256px' : '0' }">
    <template #icon>
      <img
        alt="Vue logo"
        class="logo cursor-pointer"
        src="../assets/logo.svg"
        width="75"
        height="75"
        @click="toggleSidebar"
        Logo
        click
        event
        to
        toggle
        sidebar
      />
    </template>
    <template #default>
      <div class="flex justify-between items-center w-full">
        <div>
          <h2 class="text-2xl font-semibold text-black">Rainlight Riot</h2>
          <div class="text-black">description</div>
        </div>

        <!-- Search Input aligned to the right -->
        <div class="flex justify-end items-center w-[30%]">
          <div class="relative w-full">
            <input
              type="text"
              v-model="searchInput"
              placeholder="Search for an artist"
              class="w-full pl-8 pr-4 py-4 rounded-3xl border border-gray-300 text-lg shadow-md focus:outline-none"
              @input="search"
            />
          </div>
        </div>

        <!-- Login/Profile Button on the right -->
        <div class="flex items-center space-x-2">
          <button
            v-if="!isLoggedIn"
            @click="showModal = true"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <div v-else class="flex items-center space-x-2">
            <img
              :src="Test"
              alt="Profile Picture"
              class="w-10 h-10 rounded-full"
            />
            <span class="text-black">{{ username }}</span>
          </div>
        </div>
      </div>
    </template>
  </Header>

  <!-- Sidebar -->
  <transition name="fade">
    <div
      v-if="showSidebar"
      class="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg"
    >
      <div class="p-4 flex justify-between items-center">
        <h2 class="text-3xl font-bold">Playlists</h2>
        <button
          @click="addPlaylist"
          class="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-700"
        >
          <span class="material-icons">add</span>
        </button>
      </div>
      <div class="flex mt-2">
        <p class="p-4">Add Playlist</p>
      </div>
    </div>
  </transition>

  <!-- Main Content Area -->
  <div :class="{ 'ml-64': showSidebar }" class="transition-all duration-300">
    <!-- Album Grid -->
    <Album :albums="albums" />

    <!-- Login Modal -->
    <teleport to="body">
      <LoginModal
        v-if="showModal"
        @close="showModal = false"
        @login="isLoggedIn = true"
      />
    </teleport>
  </div>
</template>

<style scoped></style>
