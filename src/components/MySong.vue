<script setup>
import { onMounted, ref } from 'vue'
import Header from './Header.vue'
import Album from './Album.vue'
import { usePlaylistStore } from '../stores/playlist'
import { useAlbumStore } from '../stores/album'
import { fetchProfileFromStorage, getAccessToken } from '../stores/login'
import PlayList from './PlayList.vue'
import DeleteModal from './DeleteModal.vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const albumStore = useAlbumStore()
const playlistStore = usePlaylistStore()
const userStore = useUserStore()
const clientId = '4728188e9b44412682442a7f74f7cce3'
const clientSecret = '6ba3ebe87a9942a3a7605963b54caae3'
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

onMounted(async () => {
    const code = localStorage.getItem('code')
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

    userStore.setUser()
    await playlistStore.setAccessToken(clientId, clientSecret)
    accessToken.value = playlistStore.getAccessToken
    await playlistStore.getTrackByPlaylist(
        accessToken.value,
        '37i9dQZF1DX812gZSD3Ky1'
    )
    tracks.value = playlistStore.getTracks
})

const toggleAddSong = () => {
    router.push({ name: 'AddSong' });
};

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
        albums.value = albumStore.getAlbums
    }
}

const getMyplayList = async (playlistsId) => {
    const track = await playlistStore.getTrackByPlaylistsIds(
        playlistsId,
        token.value
    )
    tracks.value = track
}

const createOrEditPlaylist = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    userPlaylist.value = await playlistStore.getUserPlaylist(
        user_id.value,
        token.value
    )
}
const handleDelete = async () => {
    userPlaylist.value = await playlistStore.getUserPlaylist(
        user_id.value,
        token.value
    )
    showDelete.value = false
}


const toggleDropdown = (userId) => {
    showDropdown.value = showDropdown.value === userId ? null : userId
}

const toggleEdit = async (playlistsId) => {
    router.push({ name: 'edit', params: { id: playlistsId } })
}

const deleteUser = (playlistsId) => {
    console.log(showDelete.value)

    selectedPlaylistId.value = playlistsId
    showDelete.value = true
}

const login = () => {
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
                        <input type="text" v-model="searchInput" placeholder="Search for an artist"
                            class="w-full pl-10 pr-4 py-4 rounded-3xl border border-gray-300 text-lg shadow-md focus:outline-none"
                            @input="search" />
                        <img alt="Search icon"
                            class="absolute left-3 top-1/2 transform -translate-y-1/2 filter brightness-0 invert"
                            src="../assets/search.svg" width="20" height="20" />
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <button v-if="!isLoggedIn" @click="login"
                        class="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-800 transition duration-300">
                        Login
                    </button>
                    <div v-else class="flex items-center space-x-2 border-2 rounded-full pl-4">
                        <span class="text-white"> {{ username }}</span>
                        <img src="../assets/profile.jpeg" alt="Profile Picture" class="w-12 h-12 rounded-full" />
                    </div>
                </div>
            </div>
        </template>
    </Header>

    <div class="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg overflow-y-auto">
        <div class="p-4 flex justify-between items-center">
            <h2 class="text-3xl font-bold">Rainlight Riot</h2>
            <button @click="toggleCreate"
                class="flex items-center justify-center transition-transform duration-300 hover:scale-110 rounded-full bg-slate-500 hover:bg-slate-600">
                <img alt="Vue logo" class="logo cursor-pointer" src="../assets/plus.svg" width="35" height="35" />
            </button>
        </div>

        <!-- เพิ่มปุ่ม My Song -->
        <button
            class="text-center bg-white text-purple-600 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition duration-300 ease-in-out mb-6"
            @click="router.push({ name: 'mysong' })">
            My Song
        </button>

        <div class="mt-4">
            <div v-for="user in userPlaylist" :key="user.id"
                class="relative flex justify-between items-center mt-2 hover:bg-slate-700 rounded-lg">
                <button class="text-start flex-grow flex items-center" @click="getMyplayList(user.id)">
                    <div v-if="user.images && user.images[0] && user.images[0].url">
                        <img :src="user.images[0].url" alt="Image" width="70" height="70"
                            class="p-2 object-cover rounded-lg" />
                    </div>
                    <div v-else>
                        <img src="../assets/note.svg" alt="Image" width="70" height="70"
                            class="p-2 filter brightness-0 invert" />
                    </div>

                    <div class="p-4">
                        {{ user.name }}
                    </div>
                </button>

                <button class="p-4" @click="toggleDropdown(user.id)">
                    <img alt="Vue logo" class="logo cursor-pointer filter brightness-4 invert"
                        src="../assets/options.svg" width="23" height="23" />
                </button>

                <!-- Dropdown menu -->
                <div v-if="showDropdown === user.id"
                    class="absolute right-0 top-full mt-2 w-32 bg-white text-black shadow-lg rounded-lg z-10">
                    <button class="block w-full px-4 py-2 hover:bg-gray-200 text-left rounded-lg"
                        @click="toggleEdit(user.id)">
                        Edit
                    </button>
                    <button class="block w-full px-4 py-2 hover:bg-gray-200 text-left rounded-lg"
                        @click="deleteUser(user.id)">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>


    <div class="ml-64 mt-16 p-6 bg-base-200 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-primary mb-4">My Songs</h1>
        <button @click="toggleAddSong" class="btn btn-primary">
            Add Song
        </button>
        <RouterView />
    </div>

</template>

<style scoped></style>
