async function getItems(url) {
  try {
    const data = await fetch(url)
    const items = await data.json()
    return items
  } catch (error) {
    console.log(`error: ${error}`)
    throw new Error(error)
  }
}
async function getItemById(url, id) {
  try {
    const data = await fetch(`${url}/${id}`)
    const item = await data.json()
    return item
  } catch (error) {
    console.log(`error: ${error}`)
    if (data.status === 404) return undefined
    throw new Error(error)
  }
}

async function deleteItemById(url, id) {
  console.log(`${url}/${id}`)

  try {
    const res = await fetch(`${url}/${id}`, {
      method: 'DELETE'
    })
    return res.status
  } catch (error) {
    console.log(`error: ${error}`)
    throw new Error(error)
  }
}

async function addItem(url, newItem) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newItem)
    })
    const addedItem = await res.json()
    return addedItem
  } catch (error) {
    console.log(`error: ${error}`)
    throw new Error(error)
  }
}

async function editItem(url, id, editItem) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        ...editItem
      })
    })
    const editedItem = await res.json()
    return editedItem
  } catch (error) {
    console.log(`error: ${error}`)
    throw new Error(error)
  }
}

async function login(username, password) {
  const url = 'http://localhost:5000/users'
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const users = await res.json()
    const user = users.find(
      (user) => user.username === username && user.password === password
    )
    return user
  } catch (error) {
    console.log(`error: ${error}`)
    throw new Error(error)
  }
}

const getAccessToken = async (clientId, clientSecret) => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body:
      'grant_type=client_credentials&client_id=' +
      clientId +
      '&client_secret=' +
      clientSecret
  })
  const data = await response.json()
  return data.access_token
}

const getPlayList = async (access_token, playlist) => {
  const playlistResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      }
    }
  )
  const playlistData = await playlistResponse.json()
  return playlistData.tracks.items.map((item) => item.track.album)
}

const getArtist = async (access_token, artist) => {
  const artistResponse = await fetch(
    `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      }
    }
  )
  const artistData = await artistResponse.json()
  return artistData
}
const getAlbumfromArtist = async (access_token, artist) => {
  const returnAlbums = await fetch(
    `https://api.spotify.com/v1/artists/${artist.artists.items[0].id}/albums?include_groups=album&market=US&limit=50`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      }
    }
  )
  const albumData = await returnAlbums.json()
  return albumData.items
}

const getUserPlaylists = async (user_id, access_token) => {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      }
    }
  )
  const playlists = await response.json()
  return playlists.items
}

const getAlbumsFromPlaylists = async (playlistsId, access_token) => {
  const trackResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistsId}/tracks`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      }
    }
  )
  const tracksData = await trackResponse.json()
  const playlistAlbums = tracksData.items.map((item) => item.track.album)
  return playlistAlbums
}
const fetchSpotifyTrack = async (access_token, trackId) => {
  const trackResponse = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      }
    }
  )
  const trackData = await trackResponse.json()
  return trackData
}
const getAlbumSpotifyTrack = async (access_token, albumId) => {
  const albumResponse = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      }
    }
  )
  const albumData = await albumResponse.json()
  return albumData.items
}
const createPlaylist = async (access_token, user_id, newPlayList) => {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      },
      body: JSON.stringify(newPlayList)
    }
  )
  const playlist = await response.json()
  return playlist
}

const editPlaylist = async (access_token, playlist_id, newPlayList) => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      },
      body: JSON.stringify(newPlayList)
    }
  )
  const playlist = await response.json()
  return playlist
}

const deletePlaylist = async (access_token, playlist_id) => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/followers`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      }
    }
  )
}

export {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
  getAccessToken,
  getPlayList,
  getArtist,
  getAlbumfromArtist,
  fetchSpotifyTrack,
  login,
  getAlbumSpotifyTrack,
  getUserPlaylists,
  getAlbumsFromPlaylists,
  createPlaylist,
  editPlaylist,
  deletePlaylist
}
