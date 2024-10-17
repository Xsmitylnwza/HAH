import { login } from '@/lib/fetchUtils'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

const url = `${import.meta.env.VITE_APP_URL}/users`

export const useUserStore = defineStore('user', () => {
  const user = ref('')
  const clientId = ref('')

  const getUser = () => {
    return user.value
  }
  const getClientId = () => {
    return clientId.value
  }

  const loginUser = async (username, password) => {
    try {
      const response = await login(url, username, password)
      console.log(response)

      user.value = response
      clientId.value = response.clientId
      return response.clientId
    } catch (e) {
      console.error(e)
    }
  }

  return {
    user,
    clientId,
    getUser,
    getClientId,
    loginUser
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
