import { login } from '@/lib/fetchUtils'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: ''
  }),
  getters: {
    getUser: (state) => state.user
  },
  actions: {
    async login(username, password) {
      try {
        const response = await login(username, password)
        this.user = response.clientId
        return response.clientId
      } catch (e) {
        console.error(e)
      }
    }
  }
})
