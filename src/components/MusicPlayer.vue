<script setup>
import { ref, defineProps, watch, onMounted } from 'vue'


const props = defineProps({
  previewUrl: String,
  currentTrack: Object,
})

const music = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const audioDuration = ref(0)
const volume = ref(1)
const isMuted = ref(false)

const playPause = () => {
  if (music.value) {
    if (isPlaying.value) {
      music.value.pause()
    } else {
      music.value.currentTime = 0;
      music.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
}

const seekAudio = () => {
  if (music.value) {
    music.value.currentTime = currentTime.value;
  }
}

const changeVolume = () => {
  if (music.value) {
    music.value.volume = volume.value;
    isMuted.value = volume.value === 0;
  }
}

const toggleMute = () => {
  if (music.value) {
    isMuted.value = !isMuted.value;
    music.value.muted = isMuted.value;
  }
}

watch(() => props.previewUrl, (newUrl) => {
  if (music.value) {
    if (newUrl) {
      music.value.src = newUrl;  
      music.value.load();
      currentTime.value = 0; 
      audioDuration.value = 0; 
      isPlaying.value = false; 
    } else {
      resetPlayer();
    }
  }
});
const resetPlayer = () => {
  currentTime.value = 0;
  audioDuration.value = 0;
  isPlaying.value = false;
};

onMounted(() => {
  if (music.value) {
    music.value.addEventListener('timeupdate', () => {
      currentTime.value = music.value.currentTime;
    });
    
    music.value.addEventListener('loadedmetadata', () => {
      audioDuration.value = music.value.duration;
    });
    
    music.value.addEventListener('ended', () => {
      isPlaying.value = false;
      currentTime.value = 0; 
    });
  } else {
    console.error('Music element is not available'); 
  }
});


</script>

<template>
    <div v-if="previewUrl" class="fixed bottom-0 bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-3xl left-1/2 transform -translate-x-1/2  w-full">
      <audio ref="music" class="hidden">
        <source :src="previewUrl" type="audio/mp3" />
      </audio>
    
      <div class="flex flex-col w-full ">
        <div class="flex items-center text-white text-left -mb-16 mt-3">
          <img 
            v-if="currentTrack.images && currentTrack.images.length > 0" 
            :src="currentTrack.images[0].url" 
            alt="Album Artwork" 
            class="w-16 h-16 rounded-lg mr-4" 
          />
          <div>
            <h2 class="text-lg font-semibold">{{ currentTrack.name }}</h2>  
            <p class="text-sm">{{ currentTrack.artists[0].name }}</p>  
          </div>
        </div>
        <div class="flex items-center justify-center w-full mb-4"> 
          <button @click="playPause" class="rounded-full bg-white p-2 hover:bg-gray-200">
            <img :src="isPlaying ? '/src/assets/pause.png' : '/src/assets/play.png'" class="w-8 h-8" />
          </button>
        </div>
  
        <div class="flex items-center space-x-4 w-full text-white justify-center">
          <span>{{ Math.floor(currentTime / 60) }}:{{ ('0' + Math.floor(currentTime % 60)).slice(-2) }}</span>
          <input type="range" min="0" :max="audioDuration" v-model="currentTime" @input="seekAudio" 
            class="h-1 bg-gray-700 rounded-full cursor-pointer w-2/6" />
          <span>{{ Math.floor((audioDuration - currentTime) / 60) }}:{{ ('0' + Math.floor((audioDuration - currentTime) % 60)).slice(-2) }}</span>
        </div>
      </div>
    </div>
  </template>
  

<style scoped>

</style>
