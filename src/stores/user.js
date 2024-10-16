import { login, getItems, getItemById } from '@/lib/fetchUtils'
import { defineStore } from 'pinia'
const url = 'http://localhost:5000/users'
export const useUserStore = defineStore('user', {
  state: () => ({
    user: '',
    clientSecret: '',
    clientId: ''
  }),
  getters: {
    getUser: (state) => state.user,
    getClientId: (state) => state.clientId,
    getClientSecret: (state) => state.clientSecret,
    getUserById: (state) => (id) => {
      return state.user.find((user) => user.id === id)
    }
  },
  actions: {
    async login(username, password) {
      try {
        const response = await login(username, password)
        this.clientId = response.clientId
        return response.clientId
      } catch (e) {
        console.error(e)
      }
    },
    async setUser() {
      try {
        const response = await getItems(url)
        this.user = response
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async setById(id) {
      try {
        const response = await getItemById(url, id)
        this.user = response.clientId
        this.clientSecret = response.clientSecret
        return response
      } catch (e) {
        console.error(e)
      }
    }
  }
})
