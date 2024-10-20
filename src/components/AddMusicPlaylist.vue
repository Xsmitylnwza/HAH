<script setup>
import { onMounted, ref } from 'vue';
import { usePlaylistStore } from '../stores/playlist'; // นำเข้า usePlaylistStore
import { fetchProfileFromStorage, getAccessToken } from '../stores/login';

const props = defineProps({
  previewUrl: String,
  currentTrack: Object,
  album: Object,
});

const playlistStore = usePlaylistStore(); // สร้างตัวแปรเพื่อเข้าถึง store

const token = ref('');
const user_id = ref('');
const userPlaylist = ref([]); // Array to hold user's playlists
const isModalOpen = ref(true); // ใช้เพื่อควบคุม modal

const getUserPlaylist = async () => {
  userPlaylist.value = await playlistStore.getUserPlaylist(user_id.value, token.value);
};

// ฟังก์ชันสำหรับเพิ่มเพลงลงใน Playlist
const addTrackToPlaylist = async (playlistId, trackUri) => {
  const position = 0; 
  console.log('Adding track to playlist:', playlistId);
  console.log('Track URI:', trackUri);
  
  try {
    const trackId = trackUri.split(':').pop(); 
    const formattedTrackUri = `spotify:track:${trackId.trim()}`; // ใช้ ID ในการสร้าง Track URI
    console.log('Formatted Track URI:', formattedTrackUri);
    
    const uris = [formattedTrackUri]; // รวม URIs เข้าไปใน array
    await playlistStore.addNewItemToPlayList(token.value, playlistId, uris, position); 
    

    console.log('Track added successfully to playlist:', playlistId);
    
    const updatedTracks = await playlistStore.getTrackByPlaylistsIds(playlistId, token.value);
    console.log('Updated playlist tracks:', updatedTracks);

    isModalOpen.value = false;

  } catch (error) {
    console.error('Error adding track to playlist:', error.message);
  }
};

onMounted(async () => {
  const code = localStorage.getItem('code');
  const localAccessToken = localStorage.getItem('access_token');

  if (localAccessToken) {
    token.value = localAccessToken;
  } else if (code) {
    token.value = await getAccessToken();
  }
  
  const profile = await fetchProfileFromStorage();
  if (profile) {
    user_id.value = profile.id;
    await getUserPlaylist();
  }
});
</script>



<template>
  <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
    <div class="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md">
      <div class="flex items-center justify-between">
        <p class="mr-2">Add to playlist</p>
        <img src="../assets/close.svg" alt="Close" class="cursor-pointer w-4 h-4" @click="closeModal" />
      </div>
      <div
        v-for="user in userPlaylist"
        :key="user.id"
        class="relative flex justify-between items-center mt-2 hover:bg-slate-700 rounded-lg"
      >
        <button
          class="text-start flex-grow flex items-center"
          @click="addTrackToPlaylist(user.id, props.currentTrack.uri)" 
        >
          <div v-if="user.images && user.images[0]?.url">
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
/* Add any necessary styles here */
</style>
