import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import { addItem, getItems, getItemById, editItem } from '@/lib/fetchUtils'


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
      songs.value = await getItems(url)

    } catch (e) {
      console.error(e)
    }
  }

  const getSongById = async (id) => {
    try {
      const song = await getItemById(url, id)
      return song
    } catch (error) {
      console.error(error)
    }
  }

  const updateSong = async (id, form) => {
    try {
      console.log(songs.value)
      const song = await editItem(url, id, form)
      const idx = songs.value.findIndex((element) => element.id == id)
      if (idx === -1) throw new Error("error");
      songs.value[idx] = song
      console.log(songs.value);
    }catch (error) {
      console.error(error)
    }
  }

  return {
    songs,
    getSongs,
    addNewSong,
    setAllSongs,
    getSongById,
    updateSong
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSongStore, import.meta.hot))
}
