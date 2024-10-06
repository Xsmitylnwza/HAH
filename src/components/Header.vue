<script setup>
import { defineProps } from 'vue'

defineProps({
  position: {
    type: String,
    default: 'left',
    validator(value) {
      return ['left', 'center', 'right'].includes(value)
    }
  }
})
</script>

<template>
  <div
    class="flex flex-row border border-solid border-gray-300 p-4 text-white bg-gradient-to-r from-blue-300 to-violet-400 shadow-lg"
    :class="[
      { 'items-start': position === 'left' },
      { 'items-center': position === 'center' },
      { 'items-end': position === 'right' }
    ]"
  >
    <div class="mr-4 flex-shrink-0">
      <slot name="icon"></slot>
    </div>
    <div class="flex-grow">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
