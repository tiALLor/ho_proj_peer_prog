import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/records'
import { omit } from 'lodash/fp'
import createApp from '@/app'
import {
  screeningMatcher,
  fakeScreening,
  moreScreenings,
  today,
  pastDate,
  futureDate,
} from './utils'

const db = await createTestDatabase()
const app = createApp(db)

const createScreening = createFor(db, 'Screening')
const selectScreening = selectAllFor(db, 'Screening')

const createMovie = createFor(db, 'movies')
const createUser = createFor(db, 'User')

beforeEach(async () => {
  await createMovie([
    {
      id: 1,
      title: 'Passage de Venus',
      year: 1874,
    },
    {
      id: 133093,
      title: 'The Matrix',
      year: 1999,
    },
    {
      id: 816692,
      title: 'Interstellar',
      year: 2014,
    },
  ])
  await createUser([
    {
      id: 1,
      userName: 'Jim Carry',
      role: 'user',
    },
    {
      id: 2,
      userName: 'Jonas Zimermann',
      role: 'admin',
    },
  ])
})

afterEach(async () => {
  await db.deleteFrom('Screening').execute()
  await db.deleteFrom('movies').execute()
  await db.deleteFrom('User').execute()
})

afterAll(async () => {
  await db.destroy()
})

describe('create screening with "POST"', () => {
  it('shall create a new screening with role admin', async () => {
    const screeningData = {
      movieId: 1,
      date: futureDate,
      time: '16:00:00',
      capacity: 20,
    }
    const { body } = await supertest(app)
      .post('/screening')
      .send(screeningData)
      .set('Authorization', '2')
      .expect(201)

    expect(body).toEqual([screeningMatcher(screeningData)])

    // checking directly in the database
    const screeningInDatabase = await selectScreening()
    expect(screeningInDatabase).toEqual([screeningMatcher(screeningData)])
  })
  it('shall not allow to create screening with role user', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(fakeScreening())
      .set('Authorization', '1')
      .expect(403)

    expect(body.error.message).toMatch(/User is not admin/i)
  })

  it('shall not allow to create multiple screenings', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(moreScreenings)
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/object/i)
  })

  it('shall return 400 if the movieId is incorrect', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(fakeScreening({ movieId: 2 }))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/moveId not in the database/i)
  })

  it('shall return 400 if the movieId is missing', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(omit(['movieId'], fakeScreening()))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/movieId/i)
  })

  it('shall return 400 if the date is incorrect=str', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(fakeScreening({ date: 'fdaj' }))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/date/i)
  })

  it('shall return 400 if the date is incorrect=not future=today', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(fakeScreening({ date: today }))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/date/i)
  })

  it('shall return 400 if the date is incorrect=not future=past date', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(fakeScreening({ date: pastDate }))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/date/i)
  })

  it('shall return 400 if the date is missing', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(omit(['date'], fakeScreening()))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/date/i)
  })

  it('shall return 400 if the time is incorrect', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(fakeScreening({ time: 'fdaj' }))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/time/i)
  })

  it('shall return 400 if the time is missing', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(omit(['time'], fakeScreening()))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/time/i)
  })

  it('shall return 400 if the capacity is incorrect = str', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      // @ts-ignore
      .send(fakeScreening({ capacity: 'fdaj' }))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/capacity/i)
  })

  it('shall return 400 if the capacity is incorrect = 0', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(fakeScreening({ capacity: 0 }))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/capacity/i)
  })

  it('shall return 400 if the capacity is missing', async () => {
    const { body } = await supertest(app)
      .post('/screening')
      .send(omit(['capacity'], fakeScreening()))
      .set('Authorization', '2')
      .expect(400)

    expect(body.error.message).toMatch(/capacity/i)
  })
})

describe('get all screening with "GET"', () => {
  it('shall return all screenings', async () => {
    await createScreening(moreScreenings)

    const { body } = await supertest(app).get('/screening').expect(200)

    const matcher = [
      screeningMatcher(moreScreenings[0]),
      screeningMatcher(moreScreenings[1]),
    ]
    expect(body).toEqual(matcher)

    // checking directly in the database
    const screeningInDatabase = await selectScreening()
    expect(screeningInDatabase).toEqual(matcher)
  })

  it('should return 404 if screening does not exist', async () => {
    const { body } = await supertest(app).get('/screening').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })
})

describe('GET screening by id with "GET/:id"', () => {
  it('shall return the screening by screening Id', async () => {
    await createScreening(fakeScreening({ id: 255 }))
    await createScreening(moreScreenings)

    const { body } = await supertest(app).get('/screening/255').expect(200)

    expect(body).toEqual(screeningMatcher({ id: 255 }))

    // checking directly in the database
    const userInDatabase = await selectScreening((eb) => eb('id', '=', 255))
    expect(userInDatabase).toEqual([screeningMatcher({ id: 255 })])
    expect(await selectScreening()).toHaveLength(3)
  })
  it('shall return 404 if screening does not exist', async () => {
    const { body } = await supertest(app).get('/screening/1234').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })
})

describe('DELETE screening by id with delete "DELETE/:id"', () => {
  it('shall delete the screening by screening Id', async () => {
    await createScreening(fakeScreening({ id: 321 }))
    await createScreening(moreScreenings)

    expect(await selectScreening()).toHaveLength(3)
    const { body } = await supertest(app)
      .delete('/screening/321')
      .set('Authorization', '2')
      .expect(200)

    expect(body).toEqual(screeningMatcher({ id: 321 }))
    expect(await selectScreening()).toHaveLength(2)
  })

  it('shall not allow to create screening with role user', async () => {
    await createScreening(fakeScreening({ id: 321 }))
    await createScreening(moreScreenings)

    const { body } = await supertest(app)
      .delete('/screening/321')
      .set('Authorization', '1')
      .expect(403)

    expect(body.error.message).toMatch(/User is not admin/i)
    expect(await selectScreening()).toHaveLength(3)
  })
  it('shall return 404 if screening does not exist', async () => {
    const { body } = await supertest(app)
      .delete('/screening/321')
      .set('Authorization', '2')
      .expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })
})
