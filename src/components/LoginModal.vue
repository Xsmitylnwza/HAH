<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { redirectToAuthCodeFlow } from '../stores/login'
import { useRouter } from 'vue-router'

const router = useRouter()
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

const close = () => {
  router.push({ name: 'music' })
}
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center"
  >
    <div
      class="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-3xl shadow-lg w-96 h-[50%] flex flex-col justify-center relative"
    >
      <h2 class="text-2xl font-semibold mb-4 text-white text-center">
        Login
        <button
          @click="close"
          class="absolute top-4 right-4 bg-gray-600 text-white p-1 rounded hover:bg-gray-500"
        >
          <img
            alt="Close"
            class="logo cursor-pointer"
            src="../assets/close.svg"
            width="20"
            height="20"
          />
        </button>
      </h2>

      <div class="mb-4">
        <label class="block text-white mb-1">Username</label>
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="border border-gray-300 p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
        />
      </div>

      <div class="mb-4">
        <label class="block text-white mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="border border-gray-300 p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
        />
      </div>

      <div class="flex flex-col items-center mt-8">
        <button
          @click="login"
          class="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg px-4 py-2 rounded hover:bg-blue-800 mb-4 w-full"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
