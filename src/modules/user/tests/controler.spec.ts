import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/records'
import { omit } from 'lodash/fp'
import createApp from '@/app'
import { fakeUser, moreUsers, userMatcher } from './utils'

const db = await createTestDatabase()
const app = createApp(db)
const createUser = createFor(db, 'User')
const selectUser = selectAllFor(db, 'User')

afterEach(async () => {
  await db.deleteFrom('User').execute()
})

afterAll(() => db.destroy())

describe('create user with "POST"', () => {
  it('should allow to create a new user', async () => {
    const { body } = await supertest(app)
      .post('/user')
      .send({
        userName: 'Luc Bluesky',
        role: 'admin',
      })
      .expect(201)

    expect(body).toEqual([
      userMatcher({
        userName: 'Luc Bluesky',
        role: 'admin',
      }),
    ])

    // checking directly in the database
    const userInDatabase = await selectUser()
    expect(userInDatabase).toEqual([
      userMatcher({
        userName: 'Luc Bluesky',
        role: 'admin',
      }),
    ])
  })

  // send invalid role
  it('should return 400 if role is incorrect', async () => {
    const { body } = await supertest(app)
      .post('/user')
      .send({
        userName: 'Luc Bluesky',
        role: 'manager',
      })
      .expect(400)

    expect(body.error.message).toMatch(/role/i)
  })

  it('should return 400 if role is missing', async () => {
    const { body } = await supertest(app)
      .post('/user')
      .send(omit(['role'], fakeUser()))
      .expect(400)

    expect(body.error.message).toMatch(/role/i)
  })

  it('should return 400 if role is empty', async () => {
    const { body } = await supertest(app)
      .post('/user')
      .send(fakeUser({ role: '' }))
      .expect(400)

    expect(body.error.message).toMatch(/role/i)
  })

  it('should return 400 if userName is missing', async () => {
    const { body } = await supertest(app)
      .post('/user')
      .send(omit(['userName'], fakeUser()))
      .expect(400)

    expect(body.error.message).toMatch(/userName/i)
  })

  it('should return 400 if userName is empty', async () => {
    const { body } = await supertest(app)
      .post('/user')
      .send(fakeUser({ userName: '' }))
      .expect(400)

    expect(body.error.message).toMatch(/userName/i)
  })
})

describe('find user by ID with "GET/:id"', () => {
  it('should return a user if it exists', async () => {
    await createUser(fakeUser({ id: 154 }))
    await createUser(moreUsers)

    const { body } = await supertest(app).get('/user/154').expect(200)

    expect(body).toEqual(userMatcher({ id: 154 }))

    // checking directly in the database
    const userInDatabase = await selectUser((eb) => eb('id', '=', 154))
    expect(userInDatabase).toEqual([userMatcher( { id: 154 })])
    expect(await selectUser()).toHaveLength(3)
  })

  it('should return 404 if article does not exist', async () => {
    const { body } = await supertest(app).get('/user/2912').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })
})
