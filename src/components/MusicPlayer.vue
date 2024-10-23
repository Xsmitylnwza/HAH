<script setup>
import { ref, defineProps, watch, onMounted } from 'vue'
import AddMusicPlaylist from '@/components/AddMusicPlaylist.vue'

const props = defineProps({
  previewUrl: String,
  currentTrack: Object,
  album: Object
})

const music = ref(null)
const isPlaying = ref(true)
const currentTime = ref(0)
const audioDuration = ref(0)

const volume = ref(0.5)
const volumeBeforeMute = ref(0.5)
const isMuted = ref(false)
const showModal = ref(false)

const playPause = () => {
  if (music.value) {
    if (isPlaying.value) {
      music.value.pause()
    } else {
      music.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

const seekAudio = () => {
  if (music.value) {
    music.value.currentTime = currentTime.value
  }
}

const changeVolume = () => {
  if (music.value) {
    music.value.volume = volume.value
    isMuted.value = volume.value === 0
    if (!isMuted.value) {
      volumeBeforeMute.value = volume.value
    }
  }
}

const toggleMute = () => {
  if (music.value) {
    if (isMuted.value) {
      volume.value = volumeBeforeMute.value
      music.value.volume = volumeBeforeMute.value
    } else {
      volumeBeforeMute.value = volume.value
      volume.value = 0
      music.value.volume = 0
    }
    isMuted.value = !isMuted.value
  }
}

watch(
  () => props.previewUrl,
  (newUrl) => {
    if (music.value) {
      if (newUrl) {
        music.value.src = newUrl
        music.value.load()
        currentTime.value = 0
        audioDuration.value = 0
        isPlaying.value = true
        music.value.play()
      } else {
        resetPlayer()
      }
    }
  }
)

const resetPlayer = () => {
  currentTime.value = 0
  audioDuration.value = 0
  isPlaying.value = true
}

onMounted(() => {
  if (music.value) {
    music.value.volume = 0.5
  }

  music.value.play()

  if (music.value) {
    music.value.addEventListener('timeupdate', () => {
      currentTime.value = music.value.currentTime
    })

    music.value.addEventListener('loadedmetadata', () => {
      audioDuration.value = music.value.duration
    })

    music.value.addEventListener('ended', () => {
      isPlaying.value = false
      currentTime.value = 0
    })
  } else {
    console.error('Music element is not available')
  }
})

const openModal = () => {
  showModal.value = true
}
</script>

<template>
  <div
    v-if="previewUrl"
    class="fixed bottom-0 bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-t-3xl left-0 right-0 w-full z-10 pointer-events-none"
  >
    <audio ref="music" class="hidden">
      <source :src="previewUrl" type="audio/mp3" />
    </audio>

    <div class="flex flex-col w-full pointer-events-auto">
      <div class="flex items-center text-white text-left -mb-20 mt-4">
        <img
          v-if="currentTrack.albumImage && currentTrack.albumImage !== 'null'"
          :src="currentTrack.albumImage"
          alt="Track Artwork"
          class="w-16 h-16 rounded-lg mr-4"
        />
        <img
          v-else-if="
            currentTrack &&
            currentTrack.images &&
            currentTrack.images.length > 0
          "
          :src="currentTrack.images[0].url"
          alt="Album Artwork"
          class="w-16 h-16 rounded-lg mr-6"
        />
        <div>
          <h2 class="text-lg font-semibold flex items-center z-20">
            {{ currentTrack.name }}
            <img
              src="/images/add.png"
              class="w-6 h-6 inline-block ml-2 cursor-pointer hover:opacity-80 transition duration-200 relative z-30"
              @click="openModal"
            />
          </h2>

          <p class="text-sm">{{ currentTrack.artists[0].name }}</p>
        </div>
      </div>

      <div class="flex items-center justify-center mb-4 relative z-10">
        <button
          @click="playPause"
          class="rounded-full bg-white p-2 hover:bg-gray-200 transition duration-200"
        >
          <img
            :src="isPlaying ? '/images/pause.png' : '/images/play.png'"
            class="w-6 h-6"
          />
        </button>
      </div>

      <div class="flex items-center w-full text-white">
        <div class="flex items-center space-x-4 justify-center flex-grow ml-40">
          <span
            >{{ Math.floor(currentTime / 60) }}:{{
              ('0' + Math.floor(currentTime % 60)).slice(-2)
            }}</span
          >
          <input
            type="range"
            min="0"
            :max="audioDuration"
            v-model="currentTime"
            @input="seekAudio"
            class="h-1 bg-gray-700 rounded-full cursor-pointer w-2/5"
          />
          <span
            >{{ Math.floor((audioDuration - currentTime) / 60) }}:{{
              ('0' + Math.floor((audioDuration - currentTime) % 60)).slice(-2)
            }}</span
          >
        </div>
        <div class="flex items-center space-x-4 mr-4">
          <img
            :src="
              volume === 0 || isMuted
                ? '/images/volumemute.png'
                : '/images/volume.png'
            "
            class="w-6 h-6 cursor-pointer"
            @click="toggleMute"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="volume"
            @input="changeVolume"
            class="h-1 bg-gray-700 rounded-full cursor-pointer w-4/5"
          />
        </div>
      </div>
    </div>
  </div>
  <AddMusicPlaylist
    v-if="showModal"
    @close="showModal = false"
    :previewUrl="previewUrl"
    :currentTrack="currentTrack"
  />
</template>

<style scoped></style>
