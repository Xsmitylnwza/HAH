import { defineStore } from 'pinia'
import {
  getAccessToken,
  getUserPlaylists,
  getPlayList,
  getTrack,
  getTrackByPlaylistsId,
  createPlaylist,
  editPlaylist,
  deletePlaylist
} from '../lib/fetchUtils'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlist: [],
    tracks: [],
    accessToken: ''
  }),
  getters: {
    getAccessToken: (state) => {
      return state.accessToken
    },
    getPlaylist: (state) => {
      return state.playlist
    },
    getTracks: (state) => {
      return state.tracks
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
    async getTrackByPlaylist(accessToken, playlistId) {
      try {
        const response = await getPlayList(accessToken, playlistId)
        this.tracks = response.tracks.items.map((item) => item.track.album)
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async getTrack(accessToken, id) {
      try {
        const response = await getTrack(accessToken, id)
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
    async getTrackByPlaylistsIds(playlistsId, accessToken) {
      try {
        const response = await getTrackByPlaylistsId(playlistsId, accessToken)
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
    },
    async updatePlaylist(accessToken, playlistId, newPlayList) {
      try {
        await editPlaylist(accessToken, playlistId, newPlayList)
      } catch (e) {
        console.error(e)
      }
    },
    async deletePlaylists(accessToken, playlistId) {
      try {
        await deletePlaylist(accessToken, playlistId)
      } catch (e) {
        console.error(e)
      }
    }
  }
})
