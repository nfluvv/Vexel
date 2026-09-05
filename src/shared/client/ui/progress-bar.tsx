export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
