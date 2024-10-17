import { login, getItems, getItemById } from '@/lib/fetchUtils'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

const url = 'http://localhost:5001/users'

export const useUserStore = defineStore('user', () => {
  const user = ref('')
  const clientSecret = ref('')
  const clientId = ref('')

  const getUser = () => {
    return user.value
  }

  const getClientId = () => {
    return clientId.value
  }

  const getClientSecret = () => {
    return clientSecret.value
  }

  const getUserById = (id) => {
    return user.value.find((u) => u.id === id)
  }

  const loginUser = async (username, password) => {
    try {
      const response = await login(username, password)
      user.value = response
      clientId.value = response.clientId
      clientSecret.value = response.clientSecret
      return response.clientId
    } catch (e) {
      console.error(e)
    }
  }

  const setUser = async () => {
    try {
      const response = await getItems(url)
      user.value = response
      return response
    } catch (e) {
      console.error(e)
    }
  }

  const setById = async (id) => {
    try {
      const response = await getItemById(url, id)
      clientId.value = response.clientId
      clientSecret.value = response.clientSecret
      return response
    } catch (e) {
      console.error(e)
    }
  }

  return {
    user,
    clientSecret,
    clientId,
    getUser,
    getClientId,
    getClientSecret,
    getUserById,
    loginUser,
    setUser,
    setById
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
