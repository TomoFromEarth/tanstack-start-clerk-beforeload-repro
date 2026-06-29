import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import appCss from '../styles.css?url'
import HeaderUser from '../integrations/mock-auth/header-user'
import AppAuthProvider from '../integrations/mock-auth/provider'
import { fetchAuth } from '../lib/fetchAuth'

type AuthResult = {
  userId: string
  token: string
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        src: '/customScript.js',
        type: 'text/javascript',
      },
    ],
  }),
  beforeLoad: async () => {
    const auth = (await fetchAuth()) as AuthResult | undefined

    console.log('[serverFn beforeLoad repro]', {
      environment: typeof window === 'undefined' ? 'server' : 'browser',
      auth,
      url: (fetchAuth as unknown as { url?: string }).url,
    })

    if (!auth) {
      await logRawServerFnFetch()
      throw new Error('fetchAuth returned undefined')
    }

    return auth
  },
  shellComponent: RootDocument,
})

async function logRawServerFnFetch() {
  if (typeof window === 'undefined') {
    return
  }

  const url = (fetchAuth as unknown as { url?: string }).url
  if (!url) {
    console.warn('[serverFn beforeLoad repro] fetchAuth.url missing')
    return
  }

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'x-tsr-serverfn': 'true',
    },
  })
  const body = await response.text()

  console.warn('[serverFn beforeLoad repro] raw serverFn fetch', {
    status: response.status,
    ok: response.ok,
    serialized: response.headers.get('x-tss-serialized'),
    bodyLength: body.length,
    hasSerializedResult: body.includes('"result"'),
    hasUserId: body.includes('"userId"'),
    hasToken: body.includes('"token"'),
  })
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <AppAuthProvider>
          <div className="p-2 flex gap-4 text-lg items-center">
            <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              to="/repro"
              activeProps={{
                className: 'font-bold',
              }}
            >
              Repro
            </Link>
            <HeaderUser />
          </div>
          <hr />
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </AppAuthProvider>
      </body>
    </html>
  )
}
