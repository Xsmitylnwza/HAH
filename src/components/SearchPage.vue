<script setup>
import { onMounted, ref } from 'vue'
import Header from '@/components/Header.vue'
import Album from '@/components/Album.vue'
import { usePlaylistStore } from '@/stores/playlist'
import { useAlbumStore } from '@/stores/album'
import { fetchProfileFromStorage, getAccessToken } from '@/login'
import DeleteModal from '@/components/DeleteModal.vue'
import { useRouter } from 'vue-router'
import defaultProfileImage from '/images/profile.jpeg'
import PlayListDefault from '@/components/PlayListDefault.vue'

const router = useRouter()
const albumStore = useAlbumStore()
const playlistStore = usePlaylistStore()
const accessToken = ref('')
const searchInput = ref('')
const albums = ref([])
const tracks = ref([])
const isLoggedIn = ref(false)
const username = ref('')
const user_id = ref('')
const token = ref('')
const userPlaylist = ref({})
const showDropdown = ref('')
const selectedPlaylistId = ref('')
const showDelete = ref(false)
const profileImage = ref('')

onMounted(async () => {
  const code = localStorage.getItem('code')
  let localAccessToken = localStorage.getItem('access_token')

  if (localAccessToken) {
    token.value = localAccessToken
  } else if (code) {
    token.value = await getAccessToken()
    isLoggedIn.value = true
  }
  if (code) isLoggedIn.value = true
  const profile = await fetchProfileFromStorage()
  if (profile) {
    if (profile.images.length > 0) {
      profileImage.value = profile.images[0].url
    }
    username.value = profile.display_name
    user_id.value = profile.id
    await new Promise((resolve) => setTimeout(resolve, 100))
    await playlistStore.getUserPlaylist(user_id.value, token.value)
    userPlaylist.value = await playlistStore.getPlaylist()
  }

  //No Login
  const defaultClientId = '904da645d0e64016ab25cbfc9ce444a4'
  const defaultClientSecret = '29fc6f15441b451f91885b1b423e5230'
  await playlistStore.setAccessToken(defaultClientId, defaultClientSecret)
  accessToken.value = playlistStore.getAccessTokens()
  await playlistStore.getTrackByPlaylist(
    accessToken.value,
    '37i9dQZF1DX812gZSD3Ky1'
  )
  tracks.value = playlistStore.getTracks()
})
const toggleCreate = () => {
  router.push({ name: 'create' })
}

const search = async () => {
  if (searchInput.value.trim()) {
    const artist = await albumStore.setArtist(
      accessToken.value,
      searchInput.value
    )
    await albumStore.setAlbums(accessToken.value, artist)
    albums.value = albumStore.getAlbums()
  }
}

const getMyplayList = async (playlistsId) => {
  router.push({ name: 'playlist', params: { playlistid: playlistsId } })
  const track = await playlistStore.getTrackByPlaylistsIds(
    playlistsId,
    token.value
  )
  tracks.value = track
}

const handleDelete = async (playlistId) => {
  userPlaylist.value = userPlaylist.value.filter(
    (playlist) => playlist.id !== playlistId
  )
  userPlaylist.value = await playlistStore.getPlaylist()
  showDelete.value = false
}

const toggleDropdown = (userId) => {
  showDropdown.value = showDropdown.value === userId ? null : userId
}

const toggleEdit = async (playlistsId) => {
  router.push({ name: 'edit', params: { id: playlistsId } })
}

const deleteUser = (playlistsId) => {
  selectedPlaylistId.value = playlistsId
  showDelete.value = true
}

const login = () => {
  router.push({ name: 'login' })
}

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('code')
  localStorage.removeItem('verifier')
  isLoggedIn.value = false
  username.value = ''
  user_id.value = ''
  token.value = ''
  router.push({ name: 'login' })
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
              class="w-full pl-10 py-2 rounded-3xl border border-gray-300 text-lg shadow-md focus:outline-none"
              @input="search"
            />
            <img
              alt="Search icon"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 filter brightness-0 invert"
              src="/images/search.svg"
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

          <div class="flex items-center space-x-2" v-if="isLoggedIn">
            <img
              @click="logout"
              alt="logout"
              src="/images/logout.svg"
              class="w-6 h-6 cursor-pointer filter brightness-0 invert"
            />

            <div class="flex items-center space-x-2 border-2 rounded-full pl-4">
              <span class="text-white">{{ username }}</span>
              <img
                :src="profileImage || defaultProfileImage"
                alt="Profile Picture"
                class="w-12 h-12 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Header>

  <div
    class="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg overflow-y-auto"
  >
    <div class="p-4 flex justify-between items-center">
      <h2
        class="text-3xl font-bold cursor-pointer"
        @click="router.push({ name: 'music' })"
      >
        Rainlight Riot
      </h2>
      <button
        @click="toggleCreate"
        class="flex items-center justify-center transition-transform duration-300 hover:scale-110 rounded-full bg-slate-500 hover:bg-slate-600 mt-1 ml-4"
      >
        <img
          alt="Add Playlist"
          class="logo cursor-pointer"
          src="/images/plus.svg"
          width="30"
          height="30"
        />
      </button>
    </div>

    <div class="flex justify-start mb-6 ml-4">
      <button
        class="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold w-[45%] p-4 rounded-full shadow-lg hover:scale-105 transition duration-300 ease-in-out"
        @click="router.push({ name: 'mysong' })"
      >
        My Song
      </button>
    </div>

    <div class="mt-4">
      <div
        v-for="user in userPlaylist"
        :key="user.id"
        class="relative flex justify-between items-center mt-2 hover:bg-slate-700 rounded-lg"
      >
        <button
          class="text-start flex-grow flex items-center"
          @click="getMyplayList(user.id)"
        >
          <div v-if="user.images && user.images[0] && user.images[0].url">
            <img
              :src="user.images[0].url"
              alt="Image"
              width="70"
              height="70"
              class="p-2 object-cover rounded-lg"
            />
          </div>
          <div v-else>
            <img
              src="/images/note.svg"
              alt="Image"
              width="70"
              height="70"
              class="p-2 filter brightness-0 invert"
            />
          </div>

          <div class="p-4">
            {{ user.name }}
          </div>
        </button>

        <button class="p-4" @click="toggleDropdown(user.id)">
          <img
            alt="Vue logo"
            class="logo cursor-pointer filter brightness-4 invert"
            src="/images/options.svg"
            width="23"
            height="23"
          />
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="showDropdown === user.id"
          class="absolute right-0 top-full mt-2 w-32 bg-white text-black shadow-lg rounded-lg z-10"
        >
          <button
            class="block w-full px-4 py-2 hover:bg-gray-200 text-left rounded-lg"
            @click="toggleEdit(user.id)"
          >
            Edit
          </button>
          <button
            class="block w-full px-4 py-2 hover:bg-gray-200 text-left rounded-lg"
            @click="deleteUser(user.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="searchInput && albums.length > 0" class="ml-64">
    <Album :albums="albums" />
  </div>

  <div v-if="!searchInput" class="ml-64">
    <PlayListDefault :tracks="tracks" />
  </div>

  <teleport to="body">
    <DeleteModal
      v-if="showDelete"
      message="Are you sure you want to delete this playlist?"
      @confirm="handleDelete"
      @cancel="showDelete = false"
      :playlistId="selectedPlaylistId"
    />
  </teleport>
  <RouterView />
</template>

<style scoped></style>
