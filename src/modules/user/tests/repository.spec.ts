import { describe, it } from 'vitest'
import { Insertable } from 'kysely'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/records'
import buildRepository from '../repository'
import type { User } from '@/database'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createUser = createFor(db, 'User')
const selectUser = selectAllFor(db, 'User')

const fakeUser = (
  overrides: Partial<Insertable<User>> = {}
): Insertable<User> => ({
  userName: 'John Doe',
  role: 'admin',
  ...overrides,
})

const moreUsers = [
  {
    userName: 'Jim Carry',
    role: 'user',
  },
  {
    userName: 'Jonas Zimermann',
    role: 'admin',
  },
]

const userMatcher = (overrides: Partial<Insertable<User>> = {}) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeUser(overrides),
})

afterEach(async () => {
  await db.deleteFrom('User').execute()
})

afterAll(() => db.destroy())

// create user
describe('create user', async () => {
  it('should allow to create a new user', async () => {
    const user = await repository.createUser({
      userName: 'Luc Bluesky',
      role: 'admin',
    })
    expect(user).toEqual([
      {
        id: expect.any(Number),
        userName: 'Luc Bluesky',
        role: 'admin',
      },
    ])

    const userInDatabase = await selectUser()
    expect(userInDatabase).toEqual(user)
  })

  it('should allow to create a new user with fakeUser', async () => {
    const user = await repository.createUser(fakeUser())
    expect(user).toEqual([userMatcher()])

    const userInDatabase = await selectUser()
    expect(userInDatabase).toEqual(user)
  })

  it('should allow to create several users', async () => {
    const user = await repository.createUser(fakeUser(...moreUsers))
    expect(user).toEqual([userMatcher(...moreUsers)])
  })
})

// get user by id
describe('get user', () => {
  it('should return user by id', async () => {
    // Arrange, createUser based on createFor will allow specific id
    await createUser([fakeUser({ id: 1234 })])

    const user = await repository.findUserById(1234)

    expect(user).toEqual(userMatcher({ id: 1234 }))
  })

  it('should return empty ', async () => {
    // Arrange, createUser based on createFor will allow specific id
    const user = await repository.findUserById(9999)

    expect(user).toBe(undefined)
  })

  // function shall return only one user and not a batch due to security
})
