export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  )

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[a.length][b.length]
}

export function isCloseEnough(
  input: string,
  target: string
): "exact" | "typo" | "wrong" {
  const a = input.trim().toLowerCase()
  const b = target.trim().toLowerCase()

  if (a === b) return "exact"

  const threshold = b.length <= 4 ? 1 : b.length <= 9 ? 2 : 3
  const distance = levenshteinDistance(a, b)

  return distance <= threshold ? "typo" : "wrong"
}
