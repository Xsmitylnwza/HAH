import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  getArtist,
  getAlbumfromArtist,
  getArtisttopTracks
} from '@/lib/fetchUtils'
import { ref } from 'vue'

export const useAlbumStore = defineStore('album', () => {
  const albums = ref([])
  const artist = ref('')

  const getAlbums = () => {
    return albums.value
  }

  const setArtist = async (accessToken, artistId) => {
    try {
      const response = await getArtist(accessToken, artistId)
      artist.value = response
      return artist.value
    } catch (e) {
      console.error(e)
    }
  }

  const setAlbums = async (accessToken, albumId) => {
    try {
      const response = await getAlbumfromArtist(accessToken, albumId)
      albums.value = response
      return albums.value
    } catch (e) {
      console.error(e)
    }
  }

  const getArtisttopTrack = async (accessToken, artistId) => {
    try {
      const response = await getArtisttopTracks(accessToken, artistId)
      return response
    } catch (e) {
      console.error(e)
    }
  }

  return {
    albums,
    artist,
    getAlbums,
    setArtist,
    setAlbums,
    getArtisttopTrack
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlbumStore, import.meta.hot))
}
