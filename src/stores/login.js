import { useRouter } from 'vue-router'

export async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)
  localStorage.setItem('verifier', verifier)

  const params = new URLSearchParams()
  params.append('client_id', clientId)
  params.append('response_type', 'code')
  params.append('redirect_uri', 'http://localhost:5173/music')
  params.append(
    'scope',
    'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private'
  )
  params.append('code_challenge_method', 'S256')
  params.append('code_challenge', challenge)

  localStorage.setItem('code', challenge)
  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

function generateCodeVerifier(length) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function getAccessToken(clientId) {
  const router = useRouter()
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (!code) {
    console.error('No authorization code found in the URL')
    return
  }
  const verifier = localStorage.getItem('verifier')
  const tokenParams = new URLSearchParams()
  tokenParams.append('client_id', clientId)
  tokenParams.append('grant_type', 'authorization_code')
  tokenParams.append('code', code)
  tokenParams.append('redirect_uri', 'http://localhost:5173/music')
  tokenParams.append('code_verifier', verifier)

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams
  })

  const { access_token } = await result.json()

  localStorage.setItem('access_token', access_token)
  router.push({ path: '/music' })

  return access_token
}

export async function fetchProfile(token) {
  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (result.status === 401) {
    localStorage.clear()
    window.location.href = 'http://localhost:5173/music'
  }
  return await result.json()
}

export async function fetchProfileFromStorage() {
  const token = localStorage.getItem('access_token')
  if (token) {
    return fetchProfile(token)
  }
}
