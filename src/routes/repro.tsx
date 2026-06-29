import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/repro')({
  component: ReproPage,
})

function ReproPage() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Repro route</h1>
      <p className="mt-4 text-lg">
        Click between Home and Repro using the header links to trigger
        browser-side route beforeLoad.
      </p>
    </main>
  )
}
