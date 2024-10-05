import { defineStore } from 'pinia'
import { getAccessToken, getPlayList } from '../lib/fetchUtils'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlist: [],
    accessToken: ''
  }),
  getters: {
    getAccessToken: (state) => {
      return state.accessToken
    },
    getPlaylist: (state) => {
      return state.playlist
    }
  },
  actions: {
    async setAccessToken(clientId, clientSecret) {
      try {
        const response = await getAccessToken(clientId, clientSecret)
        this.accessToken = response
      } catch (e) {
        console.error(e)
      }
    },
    async setPlayList(accessToken, playlistId) {
      try {
        const response = await getPlayList(accessToken, playlistId)
        this.playlist = response
      } catch (e) {
        console.error(e)
      }
    }
  }
})
