import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  getAccessToken,
  getUserPlaylists,
  getPlayList,
  getTrack as fetchTrack, // Renamed to avoid conflict
  getTrackByPlaylistsId,
  createPlaylist,
  editPlaylist,
  deletePlaylist,
  deleteSong,
  addItemToPlayList
} from '../lib/fetchUtils'
import { ref } from 'vue'

export const usePlaylistStore = defineStore('playlist', () => {
  const playlist = ref([])
  const tracks = ref([])
  const accessToken = ref('')

  const getAccessTokens = () => {
    return accessToken.value
  }

  const getPlaylist = () => {
    return playlist.value[0]
  }

  const getTracks = () => {
    return tracks.value
  }

  const setAccessToken = async (clientId, clientSecret) => {
    try {
      const response = await getAccessToken(clientId, clientSecret)
      accessToken.value = response
    } catch (e) {
      console.error(e)
    }
  }

  const getTrackByPlaylist = async (accessToken, playlistId) => {
    try {
      const response = await getPlayList(accessToken, playlistId)
      tracks.value = response.tracks.items.map((item) => item.track.album)
      return response
    } catch (e) {
      console.error(e)
    }
  }

  const getTrackById = async (accessToken, id) => {
    try {
      const response = await fetchTrack(accessToken, id)
      return response
    } catch (e) {
      console.error(e)
    }
  }

  const getUserPlaylist = async (user_id, accessToken) => {
    try {
      const response = await getUserPlaylists(user_id, accessToken)
      playlist.value.push(response)
      return response
    } catch (e) {
      console.error(e)
    }
  }
  const getTrackByPlaylistsIds = async (playlistsId, accessToken) => {
    try {
      const response = await getTrackByPlaylistsId(playlistsId, accessToken)
      const playlist = response.items
        .filter((item) => item.track)
        .map((item) => item.track.album)
      return playlist
    } catch (e) {
      console.error(e)
    }
  }

  const createNewPlaylist = async (accessToken, user_id, newPlayList) => {
    try {
      const response = await createPlaylist(accessToken, user_id, newPlayList)
      playlist.value[0].unshift(response)
      console.log(playlist.value)

      return response
    } catch (e) {
      console.error(e)
    }
  }

  const addNewItemToPlayList = async (accessToken, playlistId, uri) => {
    try {
      const response = await addItemToPlayList(accessToken, playlistId, uri)
      return response
    } catch (e) {
      console.error('Error in addNewItemToPlayList:', e)
    }
  }

  const updatePlaylist = async (accessToken, playlistId, newPlayList) => {
    try {
      await editPlaylist(accessToken, playlistId, newPlayList)
      const playlistIndex = playlist.value[0].findIndex(
        (playlist) => playlist.id === playlistId
      )
      if (playlistIndex !== -1) {
        playlist.value[0][playlistIndex] = {
          ...playlist.value[0][playlistIndex],
          ...newPlayList
        }
      }
      console.log(playlist.value)
    } catch (e) {
      console.error(e)
    }
  }

  const deletePlaylists = async (accessToken, playlistId) => {
    try {
      await deletePlaylist(accessToken, playlistId)
      playlist.value[0] = playlist.value[0].filter(
        (playlist) => playlist.id !== playlistId
      )
    } catch (e) {
      console.error(e)
    }
  }

  const deleteSongFromPlayList = async (accessToken, trackId, uri) => {
    try {
      const response = await deleteSong(accessToken, trackId, uri)
      return response
    } catch (e) {
      console.error(e)
    }
  }

  return {
    playlist,
    tracks,
    accessToken,
    getAccessTokens,
    getPlaylist,
    getTracks,
    setAccessToken,
    getTrackByPlaylist,
    getTrackById,
    getUserPlaylist,
    getTrackByPlaylistsIds,
    createNewPlaylist,
    updatePlaylist,
    deletePlaylists,
    deleteSongFromPlayList,
    addNewItemToPlayList
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlaylistStore, import.meta.hot))
}
