import { describe, it } from 'vitest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { fakeUser, moreUsers, userMatcher } from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createUser = createFor(db, 'User')
const selectUser = selectAllFor(db, 'User')

afterEach(async () => {
  await db.deleteFrom('User').execute()
})

afterAll(() => db.destroy())

// create user
describe('create user', () => {
  it('should allow to create a new user with data', async () => {
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
    const users = await repository.createUser(moreUsers)

    const matcher = [userMatcher(moreUsers[0]), userMatcher(moreUsers[1])]

    expect(users).toEqual(matcher)

    const usersInDatabase = await selectUser()
    expect(usersInDatabase).toEqual(matcher)
  })
})

// get user by id
describe('get user by id', () => {
  it('should return user by id', async () => {
    // Arrange, createUser based on createFor will allow specific id
    await createUser([fakeUser({ id: 1234 })])

    const user = await repository.getUserById(1234)

    expect(user).toEqual(userMatcher({ id: 1234 }))
  })

  it('should return empty ', async () => {
    // Arrange, createUser based on createFor will allow specific id
    const user = await repository.getUserById(9999)

    expect(user).toBe(undefined)
  })

  // function shall return only one user and not a batch due to security
})

describe('get all users', () => {
  it('shall return all users', async () => {
    createUser(moreUsers)

    const users = await repository.getUsers()
    expect(users).toHaveLength(2)
    expect(users).toEqual([
      userMatcher(moreUsers[0]),
      userMatcher(moreUsers[1]),
    ])
  })
})
