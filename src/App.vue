<script setup>
import { RouterView } from 'vue-router'
import MusicApp from './components/MusicApp.vue'
</script>

<template>
  <div>
    <!-- <MusicApp /> -->
    <RouterView />
  </div>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/createmysong">Create My Song</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
