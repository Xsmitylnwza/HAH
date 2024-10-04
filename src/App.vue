<script setup>
import Header from './components/Header.vue'
</script>

<template>
  <Header position="left">
    <template #icon>
      <img
        alt="Vue logo"
        class="logo"
        src="./assets/logo.svg"
        width="125"
        height="125"
      />
    </template>
    <template #default>
      <div>
        <h2 class="text-2xl font-semibold">Vue</h2>
        <div>
          A progressive JavaScript framework for building user interfaces
        </div>
      </div>
    </template>
  </Header>
</template>

<style scoped></style>
