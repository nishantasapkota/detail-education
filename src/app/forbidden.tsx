import Link from "next/link"

export default function Forbidden() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">403</p>
      <h1 className="font-serif text-3xl">You don&apos;t have access to this</h1>
      <p className="max-w-sm text-sm text-muted-foreground">Ask an admin to change your role if you need it.</p>
      <Link href="/admin" className="text-sm underline underline-offset-4">
        Back to dashboard
      </Link>
    </div>
  )
}
