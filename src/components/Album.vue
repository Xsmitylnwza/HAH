<script setup>
const props = defineProps({
  albums: Array
})
</script>

<template>
  <div
    v-if="albums.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-4 p-4"
  >
    <div
      v-for="album in albums"
      :key="album.id"
      class="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-200 hover:shadow-xl hover:-translate-y-1"
    >
      <img
        :src="album.images[0].url"
        alt="Album Cover"
        class="w-full h-64 object-cover"
      />
      <div class="p-4">
        <h3
          class="text-black text-lg font-semibold hover:text-violet-600 transition-colors duration-200"
        >
          {{ album.name }}
        </h3>
        <p class="text-gray-500">{{ album.release_date }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="text-center text-gray-500">No albums found.</p>
  </div>
</template>

<style scoped></style>
