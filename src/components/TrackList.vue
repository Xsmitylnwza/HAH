<script setup>
const props = defineProps({
  tracks: Array,
  album: Object
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold">{{ album.name }}</h2>
    <p class="text-gray-600 mb-4">{{ album.artists[0].name }}</p>

    <div class="overflow-hidden shadow rounded-lg">
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 bg-gray-200 text-left">#</th>
            <th class="py-2 px-4 bg-gray-200 text-left">Title</th>
            <th class="py-2 px-4 bg-gray-200 text-left">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(track, index) in tracks"
            :key="track.id"
            class="hover:bg-gray-100 transition-colors duration-200"
          >
            <td class="py-2 px-4">{{ index + 1 }}</td>
            <td class="py-2 px-4">{{ track.name }}</td>
            <td class="py-2 px-4">
              {{ (track.duration_ms / 60000).toFixed(2) }} min
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
