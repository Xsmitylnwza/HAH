<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { redirectToAuthCodeFlow } from '../stores/login'

const props = defineProps(['code'])

const userStore = useUserStore()
const username = ref('')
const password = ref('')
const clientId = ref('')

const login = async () => {
  await userStore.login(username.value, password.value)
  clientId.value = userStore.getUser
  if (clientId.value) {
    redirectToAuthCodeFlow(clientId.value)
    $emit('login')
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h2 class="text-lg font-semibold mb-4">Login</h2>
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="border border-gray-300 p-2 w-full mb-4 rounded"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border border-gray-300 p-2 w-full mb-4 rounded"
      />
      <div class="flex justify-end space-x-2">
        <button
          @click="$emit('close')"
          class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          @click="login"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
