<script setup>
import { onMounted, ref } from 'vue'
import Header from './Header.vue'
import LoginModal from './LoginModal.vue'
import Album from './Album.vue'
import { usePlaylistStore } from '../stores/playlist'
import { useAlbumStore } from '../stores/album'
import { fetchProfileFromStorage, getAccessToken } from '../stores/login'
import PlayList from './PlayList.vue'
import PlaylistFormModal from './PlaylistFormModal.vue'

const albumStore = useAlbumStore()
const playlistStore = usePlaylistStore()
const clientId = '904da645d0e64016ab25cbfc9ce444a4'
const clientSecret = '29fc6f15441b451f91885b1b423e5230'
const accessToken = ref('')
const searchInput = ref('')
const albums = ref([])
const playlists = ref([]) // Array of playlists
const showModal = ref(false)
const showCreatePlaylistModal = ref(false) // For controlling the playlist modal
const isLoggedIn = ref(false)
const username = ref('')
const user_id = ref('')
const token = ref('')
const userPlaylist = ref({})

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  let localAccessToken = localStorage.getItem('access_token')
  if (localAccessToken) {
    token.value = localAccessToken
  } else if (code) {
    token.value = await getAccessToken(clientId, code)
    isLoggedIn.value = true
  }
  if (code) isLoggedIn.value = true
  const profile = await fetchProfileFromStorage()
  if (profile) {
    username.value = profile.display_name
    user_id.value = profile.id
    userPlaylist.value = await playlistStore.getUserPlaylist(
      user_id.value,
      token.value
    )
  }

  await playlistStore.setAccessToken(clientId, clientSecret)
  accessToken.value = playlistStore.getAccessToken
  await playlistStore.setPlayList(accessToken.value, '37i9dQZF1DX812gZSD3Ky1')
  playlists.value = playlistStore.getPlaylist // Set playlists from the API
})

const search = async () => {
  if (searchInput.value.trim()) {
    const artist = await albumStore.setArtist(
      accessToken.value,
      searchInput.value
    )
    await albumStore.setAlbums(accessToken.value, artist)
    albums.value = albumStore.getAlbums
  }
}

const getMyplayList = async (playlistsId) => {
  const playlist = await playlistStore.getAlbumsFromPlaylist(
    playlistsId,
    token.value
  )
  playlists.value = playlist
}

const createPlaylist = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  userPlaylist.value = await playlistStore.getUserPlaylist(
    user_id.value,
    token.value
  )

  console.log(userPlaylist.value)
}

const toggleCreate = () => {
  showCreatePlaylistModal.value = true // Show the create playlist modal
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

  <div class="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg">
    <div class="p-4 flex justify-between items-center">
      <h2 class="text-3xl font-bold">Rainlight Riot</h2>
      <button
        @click="toggleCreate"
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

    <div class="mt-4">
      <div
        v-for="user in userPlaylist"
        :key="user.id"
        class="flex flex-col mt-2"
      >
        <button
          class="hover:bg-slate-700 w-full text-start"
          @click="getMyplayList(user.id)"
        >
          <div class="p-4 flex justify-between">
            <divS>
              {{ user.name }}
            </divS>
            <div class="item-center">
              <img
                alt="Vue logo"
                class="logo cursor-pointer filter brightness-0 invert items-center"
                src="../assets/options.svg"
                width="23"
                height="23"
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>

  <div v-if="searchInput && albums.length > 0" class="ml-64">
    <Album :albums="albums" />
  </div>

  <div v-else class="ml-64">
    <PlayList :playlists="playlists" />
  </div>

  <!-- Teleport for Login Modal -->
  <teleport to="body">
    <LoginModal
      v-if="showModal"
      @close="showModal = false"
      @login="isLoggedIn = true"
    />
  </teleport>

  <!-- Teleport for Create Playlist Modal -->
  <teleport to="body">
    <PlaylistFormModal
      v-if="showCreatePlaylistModal"
      @create="createPlaylist"
      @close="showCreatePlaylistModal = false"
    />
  </teleport>
</template>

<style scoped></style>
