<script setup>
const props = defineProps({
  albums: Array,
})
</script>

<template>
  <div
    v-if="albums.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-4"
  >
    <div
      v-for="album in albums"
      :key="album.id"
      class="bg-white shadow-md rounded overflow-hidden"
    >
      <img
        :src="album.images[0].url"
        alt="Album Cover"
        class="w-full h-64 object-cover"
      />
      <div class="p-4">
        <h3 class="text-lg font-semibold">{{ album.name }}</h3>
        <p class="text-gray-500">{{ album.release_date }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="text-center text-gray-500">No albums found.</p>
  </div>
</template>

<style scoped></style>
