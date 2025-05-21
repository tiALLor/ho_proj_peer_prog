import type { Insertable } from 'kysely'
import { format, addDays, subDays } from 'date-fns'
import { Screening } from '@/database'

export const fakeScreening = (
  overrides: Partial<Insertable<Screening>> = {}
): Insertable<Screening> => ({
  movieId: 133093,
  date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
  time: '17:00:00',
  capacity: 30,
  ...overrides,
})

export const pastDate = format(subDays(new Date(), 1), 'yyyy-MM-dd')
export const today = format(new Date(), 'yyyy-MM-dd')

export const moreScreenings = [
  {
    movieId: 133093,
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    time: '17:00:00',
    capacity: 30,
  },
  {
    movieId: 816692,
    date: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    time: '01:30:00',
    capacity: 25,
  },
]

export const screeningMatcher = (
  overrides: Partial<Insertable<Screening>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeScreening(overrides),
})

export const fakeScreeningFull = (
  overrides: Partial<Insertable<Screening>> = {}
) => ({
  id: 1,
  ...fakeScreening(overrides),
})
