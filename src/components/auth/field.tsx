import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FieldProps = React.ComponentProps<"input"> & {
  label: string
  name: string
  errors?: string[]
}

/** Label + input + first error message, wired up for screen readers. */
export function Field({ label, name, errors, id = name, ...props }: FieldProps) {
  const error = errors?.[0]
  const errorId = `${id}-error`
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
