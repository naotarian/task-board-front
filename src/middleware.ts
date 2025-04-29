import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const subdomain = host.replace(process.env.NEXT_PUBLIC_SUB_REPLACE!, '')
  const domain = process.env.DOMAIN || ''
  // サブドメインがない場合はスルー
  if (subdomain === domain) {
    return NextResponse.next()
  }

  // APIだけならDjangoに任せる
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // それ以外のページリクエストはここでサブドメインチェック
  const res = await fetch(`${process.env.SERVER_FETCH_URL}/organizations/check-subdomain/`, {
    headers: {
      'x-subdomain': subdomain,
    },
  })

  if (res.status !== 200) {
    // サブドメイン存在しなければ404にリダイレクト
    return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_APP_URL + '/404', request.url))
  }

  return NextResponse.next()
}
