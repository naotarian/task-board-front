import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const subdomain = host.replace('.localhost:3000', '')
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
    console.log(res.status)
    // サブドメイン存在しなければ404にリダイレクト
    console.log('サブドメインが存在しません')
    return NextResponse.redirect(new URL('http://localhost:3000/404', request.url))
  }

  return NextResponse.next()
}
