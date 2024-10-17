import { defineStore } from 'pinia';
import { ref } from 'vue';
import { addItem } from '@/lib/fetchUtils';



export const MySong = defineStore('mysong', () => {
    const item = ref([])
    const loading  = ref(false)
    const error = ref(null)

    async function addNewItem(url, newItem) {
        isLoading.value = true
        error.value = null
        try {
          const addedItem = await addItem(url, newItem)
          items.value.push(addedItem)
        } catch (err) {
          error.value = err.message
        } finally {
          isLoading.value = false
        }
      }
    
      return {
        items,
        isLoading,
        error,
        addNewItem,
      }
      
})