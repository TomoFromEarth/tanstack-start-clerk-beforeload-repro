import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Sign in, then click the link below to trigger browser-side navigation.
      </p>
      <Link className="mt-6 inline-block underline" to="/repro">
        Go to repro route
      </Link>
    </div>
  )
}
