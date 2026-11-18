"use client"

import { Button } from "@/components/ui/button"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      {error.digest && <p className="text-sm text-muted-foreground">Error id: {error.digest}</p>}
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
