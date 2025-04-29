import { API_BASE_URL } from '@/lib/constants'

// ★ リフレッシュリクエスト（Cookieベース）
export const refreshAccessToken = async (): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    credentials: 'include', // ★ Cookieを必ず送る！！
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return res.ok
}

// ★ 認証が必要なfetch
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
  }

  const csrftoken = getCookie('csrftoken')
  let res = await fetch(API_BASE_URL + url + '/', {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
  })

  if (res.status !== 401) return res

  // アクセストークン期限切れ → リフレッシュを試行
  const refreshed = await refreshAccessToken()

  if (!refreshed) {
    return res // リフレッシュ失敗 → 元の401を返す
  }

  // 再度リトライ
  res = await fetch(API_BASE_URL + url + '/', {
    ...options,
    credentials: 'include', // ★ 再リトライでもCookie送信
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  })

  return res
}

// ★ 認証不要なfetch（ログイン・新規登録など）
export const publicFetch = async (
  url: string,
  options: RequestInit = {},
  stripTrailingSlash: boolean = false
): Promise<Response> => {
  const finalUrl = stripTrailingSlash
    ? API_BASE_URL + url
    : API_BASE_URL + (url.endsWith('/') ? url : url + '/')
  return await fetch(finalUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}
