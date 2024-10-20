<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSongStore } from "../stores/song";
import { fetchProfileFromStorage } from "../stores/login";

const router = useRouter();
const songStore = useSongStore();
const user_id = ref("");

// ลดฟิลด์ใน newSong ให้เหลือเฉพาะที่ต้องการ
const newSong = ref({
  albumCover: null, // เพิ่มฟิลด์สำหรับรูปปกเพลง
  artist: "",
  musicName: "",
  musicDescription: "",
  musicLink: "", // เพิ่มฟิลด์สำหรับลิงก์เพลงแทนไฟล์
});

onMounted(async () => {
  const profile = await fetchProfileFromStorage();
  if (profile) {
    user_id.value = profile.id;
  }
});

const createSong = async () => {
  const song = await songStore.addNewSong(newSong.value)
  closeModal()
}

const closeModal = () => {
  router.push({ name: "mysong" });
};

// เพิ่มฟังก์ชันสำหรับเลือกและแสดงรูปปกเพลง
const handleCoverSelect = (files) => {
  if (files.length > 0) {
    const cover = URL.createObjectURL(files[0]);
    newSong.value.albumCover = cover;
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
  >
    <div
      class="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-4xl flex space-x-6"
    >
      <!-- ส่วนของรูปปกเพลงใหญ่ทางซ้าย -->
      <div class="w-1/2">
        <label class="block mb-2 font-bold">Music cover</label>
        <div class="aspect-w-1 aspect-h-1">
          <img
            v-if="newSong.albumCover"
            :src="newSong.albumCover"
            alt="Album Cover"
            class="object-cover w-full h-full rounded-lg border border-gray-300"
          />
          <div
            v-else
            class="bg-gray-100 flex justify-center items-center w-full h-full rounded-lg border border-gray-300"
          >
            <span class="text-gray-500">Choose Cover</span>
          </div>
        </div>

        <!-- ปุ่มอัปโหลดรูปปก -->
        <input
          type="file"
          accept="image/*"
          class="mt-4 block w-full text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer"
          @change="handleCoverSelect($event.target.files)"
        />
      </div>

      <!-- ฟอร์มกรอกข้อมูลทางขวา -->
      <div class="w-1/2 space-y-4">
        <h2 class="text-2xl font-bold mb-4">Add Music</h2>

        <div>
          <label class="text-gray-500">Music name</label>
          <input
            v-model="newSong.musicName"
            type="text"
            class="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Music name"
          />
        </div>

        <div>
          <label class="text-gray-500">Artist</label>
          <input
            v-model="newSong.artist"
            type="text"
            class="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Artist"
          />
        </div>

        <div>
          <label class="text-gray-500">Music Description</label>
          <input
          v-model="newSong.musicDescription"
          type="text"
          class="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Music Description"
        />
        </div>
        
        <div>
          <label class="text-gray-500">Music Link</label>
          <input
          v-model="newSong.musicLink"
          type="text"
          class="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Music Link"
        />
        </div>
        

        <div class="flex justify-end space-x-2">
          <button
            @click="createSong"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            add
          </button>
          
          <button
            @click="closeModal"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
