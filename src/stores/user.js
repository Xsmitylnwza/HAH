import { login } from '@/lib/fetchUtils'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: '',
    token: '',
    profile: {},
    isLoggedIn: false
  }),
  getters: {
    getUser: (state) => state.user,
    username: (state) => state.profile.display_name || 'Test'
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
    },
    setToken(value) {
      this.token = value
    },
    setProfile(value) {
      this.profile = value
    },
    setIsLoggedIn(value) {
      this.isLoggedIn = value
    }
  }
})
