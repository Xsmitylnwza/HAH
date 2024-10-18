<script setup>
import { onMounted, ref, watch } from 'vue'
import { usePlaylistStore } from '../stores/playlist'
import { fetchProfileFromStorage, getAccessToken } from '../stores/login'
import { useRouter } from 'vue-router'


const playlistStore = usePlaylistStore()
const token = ref('')
const user_id = ref('')
const userPlaylist = ref({})


const getUserPlaylist = async () => {
  userPlaylist.value = await playlistStore.getUserPlaylist(user_id.value, token.value)
}


onMounted(async () => {
  const code = localStorage.getItem('code')
  const localAccessToken = localStorage.getItem('access_token')

  if (localAccessToken) {
    token.value = localAccessToken
  } else if (code) {
    token.value = await getAccessToken()
  }
  
  const profile = await fetchProfileFromStorage()
  if (profile) {
    user_id.value = profile.id
    await getUserPlaylist()
  }
})



</script>

<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
    <div class="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <div class="flex items-center justify-between">
            <p class="mr-2">Add to playlist</p>
            <img src="../assets/close.svg" alt="Close" class="cursor-pointer w-4 h-4" @click="$emit('close')" />
        </div>
        <div
        v-for="user in userPlaylist"
        :key="user.id"
        class="relative flex justify-between items-center mt-2 hover:bg-slate-700 rounded-lg"
      >
        <button
          class="text-start flex-grow flex items-center"
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
              src="../assets/note.svg"
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
        </div>
     </div>
  </div>
</template>

<style scoped>

</style>
