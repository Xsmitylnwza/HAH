import { defineStore } from 'pinia'
import { getArtist, getAlbumfromArtist } from '../lib/fetchUtils'

export const useAlbumStore = defineStore('album', {
  state: () => ({
    album: [],
    artist: ''
  }),
  getters: {
    getAlbums: (state) => {
      return state.album
    }
  },
  actions: {
    async setAllAlbums(access_token){

    },
    async setArtist(accessToken, artist) {
      try {
        const response = await getArtist(accessToken, artist)
        this.artist = response
        return this.artist
      } catch (e) {
        console.error(e)
      }
    },
    async setAlbums(accessToken, albumId) {
      try {
        const response = await getAlbumfromArtist(accessToken, albumId)
        this.album = response
        return this.album
      } catch (e) {
        console.error(e)
      }
    }
  }
})
