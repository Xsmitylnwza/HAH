import { defineStore } from 'pinia'
import {
  getAccessToken,
  getUserPlaylists,
  getPlayList,
  fetchSpotifyTrack,
  getAlbumSpotifyTrack,
  getAlbumsFromPlaylists,
  createPlaylist
} from '../lib/fetchUtils'

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
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async getSpotifyTrack(accessToken, trackId) {
      try {
        const response = await fetchSpotifyTrack(accessToken, trackId)
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async getAlbumSpotifyTrack(accessToken, albumId) {
      try {
        const response = await getAlbumSpotifyTrack(accessToken, albumId)
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async getUserPlaylist(user_id, accessToken) {
      try {
        const response = await getUserPlaylists(user_id, accessToken)
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async getAlbumsFromPlaylist(playlistsId, accessToken) {
      try {
        const response = await getAlbumsFromPlaylists(playlistsId, accessToken)
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async createPlaylist(accessToken, user_id, newPlayList) {
      try {
        const response = await createPlaylist(accessToken, user_id, newPlayList)
        return response
      } catch (e) {
        console.error(e)
      }
    }
  }
})
