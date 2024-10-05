<script setup>
import { onMounted, ref } from 'vue'
import Header from './components/Header.vue'
import LoginModal from './components/LoginModal.vue'
import { usePlaylistStore } from './stores/playlist'
import { useAlbumStore } from './stores/album'
import { fetchProfile, getAccessToken } from './stores/login'

const albumStore = useAlbumStore()
const playlistStore = usePlaylistStore()
const clientId = '904da645d0e64016ab25cbfc9ce444a4'
const clientSecret = '29fc6f15441b451f91885b1b423e5230'
const accessToken = ref('')
const searchInput = ref('')
const albums = ref([])
const lyrics = ref('')
const showModal = ref(false)
const isLoggedIn = ref(false)

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  if (code) isLoggedIn.value = true
  await playlistStore.setAccessToken(clientId, clientSecret)
  accessToken.value = playlistStore.getAccessToken
  const token = await getAccessToken(clientId, code)
  console.log(await fetchProfile(token))

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
</script>

<template>
  <Header position="left">
    <template #icon>
      <img
        alt="Vue logo"
        class="logo"
        src="./assets/logo.svg"
        width="75"
        height="75"
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

        <!-- Login/Profile Button -->
        <div>
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

  <!-- Album Grid -->
  <div
    v-if="albums.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-4"
  >
    <div
      v-for="album in albums"
      :key="album.id"
      class="bg-white shadow-md rounded overflow-hidden"
    >
      <img
        :src="album.images[0].url"
        alt="Album Cover"
        class="w-full h-64 object-cover"
      />
      <div class="p-4">
        <h3 class="text-lg font-semibold">{{ album.name }}</h3>
        <p class="text-gray-500">{{ album.release_date }}</p>
      </div>
    </div>
  </div>

  <div v-else>
    <p class="text-center text-gray-500">No albums found.</p>
  </div>

  <!-- Display Lyrics -->
  <div v-if="lyrics" class="mt-4">
    <h2 class="text-xl font-semibold">Lyrics:</h2>
    <pre class="border border-gray-300 p-4 mt-2 bg-gray-100">{{ lyrics }}</pre>
  </div>

  <!-- Login Modal (Using Teleport) -->
  <teleport to="body">
    <LoginModal
      v-if="showModal"
      :code="code"
      @close="showModal = false"
      @login="isLoggedIn = true"
    />
  </teleport>
</template>

<style scoped></style>
