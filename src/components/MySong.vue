<script setup>
import { onMounted, ref, computed } from 'vue'
import Header from '@/components/Header.vue'
import { fetchProfileFromStorage } from '@/login'
import { useRouter } from 'vue-router'
import { useSongStore } from '@/stores/song'
import EditMySong from '@/components/EditMySong.vue'
import noteImage from '/images/note.svg'
import defaultProfileImage from '/images/profile.jpeg'
import DeleteModal from '@/components/DeleteModal.vue'

const songStore = useSongStore()
const router = useRouter()
const isLoggedIn = ref(false)
const username = ref('')
const selectSongId = ref('')
const currentAudio = ref(null)
const currentSong = ref(null)
const showEdit = ref(false)
const showDelete = ref(false)
const songToDelete = ref('')
const searchInput = ref('')
const profileImage = ref('')

onMounted(async () => {
  const code = localStorage.getItem('code')
  let localAccessToken = localStorage.getItem('access_token')
  if (localAccessToken && code) isLoggedIn.value = true
  const profile = await fetchProfileFromStorage()
  if (profile) {
    profileImage.value = profile.images[0].url
    username.value = profile.display_name
  }
  await songStore.setAllSongs()
})

const filteredSongs = computed(() => {
  if (!searchInput.value) {
    return songStore.songs
  }
  return songStore.songs.filter((song) =>
    song.musicName.toLowerCase().includes(searchInput.value.toLowerCase())
  )
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

const toggleDelete = (id) => {
  showDelete.value = true
  songToDelete.value = id
}

const confirmDelete = async () => {
  try {
    await songStore.deleteSong(songToDelete.value)
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting song:', error)
  }
}

const closeDeleteModal = () => {
  showDelete.value = false
  songToDelete.value = null
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
              class="w-full pl-10 py-2 rounded-3xl border border-gray-300 text-lg shadow-md focus:outline-none cursor-pointer"
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
            class="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold px-8 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
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
    <h1 class="text-3xl font-bold text-purple-500 mb-4">My Songs</h1>
    <div class="flex justify-end mb-4">
      <button
        @click="toggleAddSong"
        class="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold w-[15%] p-4 rounded-full shadow-lg hover:scale-105 transition duration-300 ease-in-out"
      >
        Add Song
      </button>
    </div>

    <table
      class="table-auto w-full mt-6 border border-gray-300 rounded-lg overflow-hidden"
    >
      <thead class="bg-gray-200">
        <tr>
          <th class="px-4 py-2 text-center text-black">Cover</th>
          <th class="px-4 py-2 text-center text-black">Song Title</th>
          <th class="px-4 py-2 text-center text-black">Artist Name</th>
          <th class="px-4 py-2 text-center text-black">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="song in filteredSongs"
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
                src="/images/note.svg"
                alt="Default Cover"
                class="w-16 h-16 rounded-lg filter brightness-0 invert"
              />
            </div>
          </td>
          <td class="px-4 py-2 text-center text-white">{{ song.musicName }}</td>
          <td class="px-4 py-2 text-center text-white">{{ song.artist }}</td>
          <td class="px-4 py-2 text-center">
            <div class="flex justify-center space-x-2">
              <button
                class="w-20 px-2 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded"
                @click.stop="editSongData(song.id)"
              >
                Edit
              </button>

              <button
                class="w-20 px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                @click.stop="toggleDelete(song.id)"
              >
                Delete
              </button>
            </div>
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

    <teleport to="body">
      <DeleteModal
        v-if="showDelete"
        :message="`Are you sure you want to delete this song`"
        @confirm="confirmDelete"
        @cancel="closeDeleteModal"
      />
    </teleport>
    <RouterView />
  </div>
</template>
