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
    class="flex flex-row p-2 text-white bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg"
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
