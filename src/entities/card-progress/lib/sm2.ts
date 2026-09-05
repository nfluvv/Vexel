export type Quality = 0 | 1 | 2 | 3

export type SM2State = {
  easeFactor: number
  interval: number
  repetitions: number
}

const MIN_EASE_FACTOR = 1.3

const QUALITY_TO_SM2_SCALE: Record<Quality, number> = {
  0: 0,
  1: 3,
  2: 4,
  3: 5,
}

export function calculateNextReview(
  state: SM2State,
  quality: Quality
): SM2State {
  const q = QUALITY_TO_SM2_SCALE[quality]

  if (q < 3) {
    return {
      easeFactor: state.easeFactor,
      interval: 1,
      repetitions: 0,
    }
  }

  const repetitions = state.repetitions + 1

  let interval: number
  if (repetitions === 1) {
    interval = 1
  } else if (repetitions === 2) {
    interval = 6
  } else {
    interval = Math.round(state.interval * state.easeFactor)
  }

  const easeFactor = Math.max(
    MIN_EASE_FACTOR,
    state.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  )

  return { easeFactor, interval, repetitions }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
