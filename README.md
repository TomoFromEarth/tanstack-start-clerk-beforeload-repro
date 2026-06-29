# TanStack Start Clerk beforeLoad server function repro

Minimal reproduction for a local dev-only issue where a TanStack Start
`createServerFn` called from root route `beforeLoad` can resolve to `undefined`
during browser-side navigation, even though the server function endpoint returns
a serialized result.

## Setup

```sh
pnpm install
cp .env.example .env.local
```

Fill in `.env.local` with a Clerk development app:

```sh
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Then run:

```sh
pnpm dev
```

Open `http://localhost:3000`, sign in with Clerk, then click between `Home` and
`Repro`.

## Expected

The root route `beforeLoad` calls `fetchAuth()` and receives:

```ts
{
  userId: string | null
  token: string | null
}
```

## Failure being investigated

In the original app, during local Vite dev SPA navigation only,
`await fetchAuth()` resolved to `undefined`, while manually fetching the
underlying server function URL returned HTTP 200 with a valid serialized
payload.

This repo logs:

```txt
[serverFn beforeLoad repro]
```

If `fetchAuth()` resolves to `undefined`, it also attempts a raw fetch of the
server function URL and logs:

```txt
[serverFn beforeLoad repro] raw serverFn fetch
```

Confirmed local repro output:

```txt
[serverFn beforeLoad repro] raw serverFn fetch {
  status: 200,
  ok: true,
  serialized: 'true',
  bodyLength: 1300,
  hasSerializedResult: true,
  hasUserId: true,
  hasToken: true
}
```

That raw fetch log only runs after `await fetchAuth()` returned `undefined`.
The direct server function endpoint returns a serialized result, but the
client-side server function wrapper returned no value.
