import { defineStore } from 'pinia'
import {
  getArtist,
  getAlbumfromArtist,
  getArtisttopTracks
} from '../lib/fetchUtils'

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
    },
    async getArtisttopTrack(accessToken, artistId) {
      try {
        const response = await getArtisttopTracks(accessToken, artistId)
        return response
      } catch (e) {
        console.error(e)
      }
    }
  }
})
