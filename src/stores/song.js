import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import { addItem, getItems } from '@/lib/fetchUtils'

const url = `${import.meta.env.VITE_APP_URL}/songs`

export const useSongStore = defineStore('song', () => {
  const songs = ref([])

  const getSongs = () => {
    return songs.value
  }

  const addNewSong = async (formData) => {
    // Change parameter to formData
    try {
      const newSong = await addItem(url, formData) // Pass formData directly
      songs.value.push(newSong)
      return newSong
    } catch (e) {
      console.error(e)
    }
  }

  const setAllSongs = async () => {
    try {
      const songs = await getItems(url)
      return songs
    } catch (e) {
      console.error(e)
    }
  }
  return {
    songs,
    getSongs,
    addNewSong,
    setAllSongs
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSongStore, import.meta.hot))
}
