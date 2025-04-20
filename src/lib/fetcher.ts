import { API_BASE_URL } from '@/lib/constants'
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return null

  const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (!res.ok) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    return null
  }

  const data = await res.json()
  localStorage.setItem('access_token', data.access)
  return data.access
}

export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('access_token')

  const res = await fetch(API_BASE_URL + url + '/', {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.status !== 401) return res

  // アクセストークン切れ → refresh 試行
  const newToken = await refreshAccessToken()
  if (!newToken) return res

  // トークン更新後に再試行
  return await fetch(API_BASE_URL + url + '/', {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${newToken}`,
    },
  })
}

// 認証不要な共通 fetch（ログイン・新規登録など）
export const publicFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  return await fetch(API_BASE_URL + url + '/', {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}
