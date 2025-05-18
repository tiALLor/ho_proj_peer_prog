import { omit } from 'lodash'
import * as schema from '../schema'
import { fakeUserFull } from './utils'

it('parse a valid record', () => {
  const record = fakeUserFull()

  expect(schema.parse(record)).toEqual(record)
})

it('throws a error by empty of userName or role', () => {
  expect(() => schema.parse(fakeUserFull({ userName: '' }))).toThrow(
    /userName/i
  )
  expect(() => schema.parse(fakeUserFull({ role: '' }))).toThrow(/role/i)
})

it('throws a error by incorrect role value', () => {
  expect(() => schema.parse(fakeUserFull({ role: 'manager' }))).toThrow(/role/i)
})

it('throws a error by missing userName or role', () => {
  expect(() => schema.parse(omit(fakeUserFull(), ['userName']))).toThrow(
    /userName/i
  )
  expect(() => schema.parse(omit(fakeUserFull(), ['role']))).toThrow(/role/i)
})

describe('parseId', () => {
  it('should throw a error if id is not a number', () => {
    expect(() => schema.parseId(fakeUserFull({ id: 'jhash'}))).toThrow(/Expected number/)
  })
})

describe('parseInsertable', () => {
  it('omits id', () => {
    expect(schema.parseInsertable(fakeUserFull())).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    expect(schema.parseUpdateable(fakeUserFull())).not.toHaveProperty('id')
  })
})
