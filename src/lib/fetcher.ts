import { API_BASE_URL } from '@/lib/constants'

// ★ リフレッシュリクエスト（Cookieベース）
export const refreshAccessToken = async (): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return res.ok
}

// ★ 認証が必要なfetch
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('auth_token')
  console.log(token)
  let res = await fetch(API_BASE_URL + url + '/', {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
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
export const publicFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  return await fetch(API_BASE_URL + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  })
}
