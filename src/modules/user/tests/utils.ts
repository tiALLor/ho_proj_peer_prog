import { Insertable } from 'kysely'
import type { User } from '@/database'

export const fakeUser = (
  overrides: Partial<Insertable<User>> = {}
): Insertable<User> => ({
  userName: 'John Doe',
  role: 'admin',
  ...overrides,
})

export const moreUsers: Insertable<User>[] = [
  {
    userName: 'Jim Carry',
    role: 'user',
  },
  {
    userName: 'Jonas Zimermann',
    role: 'admin',
  },
]

export const userMatcher = (overrides: Partial<Insertable<User>> = {}) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeUser(overrides),
})

export const fakeUserFull = (overrides: Partial<Insertable<User>> = {}) => ({
  id: 1,
  ...fakeUser(overrides),
})
