import { omit } from 'lodash'
import * as schema from '../schema'
import { fakeScreeningFull } from './utils'

// global import of vitest describe, it, except
describe('schema.parse is correctly validating Screening records', () => {
  it('parse a valid record', () => {
    const record = fakeScreeningFull()

    expect(schema.parse(record)).toEqual(record)
  })

  it('throw a error if movieId, date, time or capacity are empty', () => {
    expect(() =>
      schema.parse(
        fakeScreeningFull({
          // @ts-ignore
          movieId: '',
        })
      )
    ).toThrow(/movieId/i)

    expect(() =>
      schema.parse(
        fakeScreeningFull({
          date: '',
        })
      )
    ).toThrow(/date/i)

    expect(() =>
      schema.parse(
        fakeScreeningFull({
          time: '',
        })
      )
    ).toThrow(/time/i)

    expect(() =>
      schema.parse(
        fakeScreeningFull({
          // @ts-ignore
          capacity: '',
        })
      )
    ).toThrow(/capacity/i)
  })

  it('throw a error if movieId, date, time or capacity have invalid data', () => {
    expect(() =>
      schema.parse(
        fakeScreeningFull({
          // @ts-ignore
          movieId: 'sdfsa',
        })
      )
    ).toThrow(/movieId/i)

    expect(() =>
      schema.parse(
        fakeScreeningFull({
          movieId: 0,
        })
      )
    ).toThrow(/movieId/i)

    expect(() =>
      schema.parse(
        fakeScreeningFull({
          date: '20150501',
        })
      )
    ).toThrow(/date/i)

    expect(() =>
      schema.parse(
        fakeScreeningFull({
          time: '17:00',
        })
      )
    ).toThrow(/time/i)

    expect(() =>
      schema.parse(
        fakeScreeningFull({
          // @ts-ignore
          capacity: 'sytewye',
        })
      )
    ).toThrow(/capacity/i)

    expect(() =>
      schema.parse(
        fakeScreeningFull({
          capacity: 0,
        })
      )
    ).toThrow(/capacity/i)
  })

  it('throws a error if movieId, date, time or capacity keys are missing', () => {
    expect(() => schema.parse(omit(fakeScreeningFull(), 'movieId'))).toThrow(
      /movieId/i
    )

    expect(() => schema.parse(omit(fakeScreeningFull(), 'date'))).toThrow(
      /date/i
    )

    expect(() => schema.parse(omit(fakeScreeningFull(), 'time'))).toThrow(
      /time/i
    )

    expect(() => schema.parse(omit(fakeScreeningFull(), 'capacity'))).toThrow(
      /capacity/i
    )
  })
})

describe('parseId', () => {
  it('should throw a error if id is not a number', () => {
    // @ts-ignore
    expect(() => schema.parseId(fakeScreeningFull({ id: 'jhash' }))).toThrow(
      /Expected number/
    )
  })
})

describe('parseInsertable', () => {
  it('omits id', () => {
    expect(schema.parseInsertable(fakeScreeningFull())).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    expect(schema.parseUpdateable(fakeScreeningFull())).not.toHaveProperty('id')
  })
})
