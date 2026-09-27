import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDate, formatRelativeTime } from './dateUtils.js'

const NOW = new Date('2026-09-27T12:00:00Z')
const ago = (ms) => new Date(NOW.getTime() - ms).toISOString()
const MIN = 60 * 1000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
})

afterEach(() => vi.useRealTimers())

describe('formatRelativeTime', () => {
    it.each([
        [ago(30 * 1000), 'Just now'],
        [ago(5 * MIN), '5m ago'],
        [ago(3 * HOUR), '3h ago'],
        [ago(2 * DAY), '2d ago'],
        [ago(65 * DAY), '2mo ago'],
    ])('%s → %s', (input, expected) => {
        expect(formatRelativeTime(input)).toBe(expected)
    })

    it('falls back to an absolute date after a year', () => {
        const input = ago(400 * DAY)
        expect(formatRelativeTime(input)).toBe(formatDate(input))
    })

    it('returns an empty string for missing or invalid input', () => {
        expect(formatRelativeTime('')).toBe('')
        expect(formatRelativeTime('not a date')).toBe('')
    })
})
