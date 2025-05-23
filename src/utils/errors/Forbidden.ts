import { StatusCodes } from 'http-status-codes'

export default class Forbidden extends Error {
  status: number

  constructor(message: string) {
    super(message)
    this.status = StatusCodes.FORBIDDEN
  }
}
