<script setup>
import { usePlaylistStore } from "../stores/playlist";
import { ref } from "vue";
import MusicPlayer from "./MusicPlayer.vue";

const props = defineProps({
  tracks: Array,
  playlistId : String
});



const playlistStore = usePlaylistStore();
let accessToken = localStorage.getItem("access_token");

const previewUrl = ref("");
const currentTrack = ref(null);
const currentTime = ref(0);
const audioDuration = ref(0);
const isPlaying = ref(false);
const showDropdown = ref("");
const showDelete = ref(false);
const songToDelete = ref([])
const uri = ref('')
const trackId = ref('')

const click = async (track) => {
  try {
    const tracks = await playlistStore.getTrackById(accessToken, track.id)

    if (tracks && tracks.length > 0) {
      const firstTrack = tracks[0]

      if (firstTrack.preview_url) {
        previewUrl.value = firstTrack.preview_url
        uri.value = firstTrack.uri
        trackId.value = firstTrack.id

        currentTrack.value = track
      } else {
        resetPlayer()
      }
    } else {
      resetPlayer()
    }
  } catch (error) {
    console.error('Error fetching track:', error)
    resetPlayer()
  }
}

const deleteSong = async (track) => {
  currentTrack.value = track.id
  try {
    const result = await playlistStore.deleteSongFromPlayList(accessToken, props.playlistId, uri.value);
    songToDelete.value = result
  } catch (error) {
    console.error(error)
  }
  showDelete.value = true;
};

const resetPlayer = () => {
  previewUrl.value = null;
  currentTrack.value = null;
  currentTime.value = 0;
  audioDuration.value = 0;
  isPlaying.value = false;
};

const toggleDropdown = (trackId) => {
  showDropdown.value = showDropdown.value === trackId ? null : trackId;
};
</script>

<template>
  <div
    v-if="tracks.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-4 p-4"
  >
    <div
      v-for="track in tracks"
      :key="track.id"
      class="relative bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-200 hover:shadow-xl hover:-translate-y-1"
      @click="click(track)"
    >
      <button
        class="p-4 bg-slate-500 rounded-full btn btn-circle cursor-pointer"
        @click="toggleDropdown(track.id)"
      >
        <img
          alt="Vue logo"
          class="logo cursor-pointer filter brightness-4 invert"
          src="../assets/options.svg"
          width="23"
          height="23"
        />
      </button>

      <!-- Dropdown menu -->
      <div
        v-if="showDropdown === track.id"
        class="absolute right-10px top-16 mt-2 w-32 bg-white text-black shadow-lg rounded-lg z-20"
      >
        <button
          class="block w-full px-4 py-2 hover:bg-gray-200 text-left rounded-lg"
          @click="deleteSong(track)"
        >
          Delete
        </button>
      </div>

      <img
        :src="track.images[0].url"
        alt="Album Cover"
        class="w-full h-64 object-cover"
      />

      <div class="p-4">
        <h3
          class="text-black text-lg font-semibold hover:text-violet-600 transition-colors duration-200"
        >
          {{ track.name }}
        </h3>
        <p class="text-gray-500">{{ track.artists[0].name }}</p>
      </div>
    </div>
  </div>

  <div v-else>
    <p class="text-center text-gray-500">No playlists found.</p>
  </div>

  <MusicPlayer
    v-if="currentTrack"
    :previewUrl="previewUrl"
    :currentTrack="currentTrack"
  />
  <teleport to="body">
    <DeleteModal
      v-if="showDelete"
      message="Are you sure you want to remove this song from this playlist"
      @confirm="handleDelete"
      @cancel="showDelete = false"
      :playlistId="selectedPlaylistId"
    />
  </teleport>
</template>

<style scoped></style>
