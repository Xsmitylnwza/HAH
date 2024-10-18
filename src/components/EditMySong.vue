<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSongStore } from '../stores/song'
import { fetchProfileFromStorage } from '../stores/login'

const router = useRouter()
const songStore = useSongStore()
const song = ref({})
// const user_id = ref('')
const props = defineProps({
  songId : {type: String, Required : true}
})
const emit = defineEmits(["closeModal"])

const form = reactive({
  albumCover: null,
  artist: '',
  musicName: '',
  musicDescription: '',
  musicLink: null
})

onMounted(async () => {
  await fetchSong()
  loadSongData()
})

const sendCloseModal = () => {
  emit("closeModal", false)
  router.push('/mysong')
}

const loadSongData = () => {
  form.albumCover = song.value.albumCover  
  form.artist = song.value.artist
  form.musicName = song.value.musicName
  form.musicDescription = song.value.musicDescription
  form.musicLink = song.value.musicLink
}

const handleCoverSelect = (files) => {
  if (files.length > 0) {
    form.albumCover = URL.createObjectURL(files[0])
  }
}

const handleSubmit = async () => {
  console.log(form);
  
  await songStore.updateSong(props.songId, form)
  emit("closeModal", false)
}

const fetchSong = async () => {
  try {
    const result = await songStore.getSongById(props.songId);
    song.value = result; 
  } catch (error) {
    console.error('Error fetching song:', error.message);
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
    <div class="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-4xl flex space-x-6">

      <div class="w-1/2">
        <label class="block mb-2 font-bold">รูปปกเพลง</label>
        <div class="aspect-w-1 aspect-h-1">
          <img
            v-if="form.albumCover"
            :src="form.albumCover"
            alt="Album Cover"
            class="object-cover w-full h-full rounded-lg border border-gray-300"
          />
          <div
            v-else
            class="bg-gray-100 flex justify-center items-center w-full h-full rounded-lg border border-gray-300"
          >
            <span class="text-gray-500">เลือกรูปปก</span>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          class="mt-4 block w-full text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer"
          @change="handleCoverSelect($event.target.files)"
        />
      </div>

      <div class="w-1/2">
        <h2 class="text-2xl font-bold mb-4">แก้ไขเพลง</h2>

        <div>
        <label class="text-gray-500">ชื่อเพลง</label>
        <input
          v-model="form.musicName"
          type="text"
          class="w-full p-3 mb-4 border border-gray-300 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ชื่อเพลง"
        />
        </div>
     
        <div>
           <label class="text-gray-500 ">ชื่อศิลปิน</label>
        <input
          v-model="form.artist"
          type="text"
          class="w-full p-3 mb-4 border border-gray-300 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ชื่อศิลปิน"
        />
        </div>
       
        <div>
           <label class="text-gray-500">คำอธิบายเพลง</label>
        <input
          v-model="form.musicDescription"
          type="text"
          class="w-full p-3 mb-4 border border-gray-300 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="คำอธิบายเพลง"
        />
        </div>
       

        <div class="flex justify-end space-x-2">
          <button
            @click="handleSubmit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            บันทึก
          </button>

          <button
            @click="sendCloseModal"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
