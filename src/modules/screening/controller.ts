import { Router } from 'express'
import { isArray } from 'lodash'
import type { Database } from '@/database'
import * as schema from './schema'
import { jsonRoute, unsupportedRoute } from '@/utils/middleware'
import buildRepository from './repository'
import buildRepositoryUser from '@/modules/user/repository'
import buildRepositoryMovie from '@/modules/movies/repository'
import NotFound from '../../utils/errors/NotFound'
import BadRequest from '@/utils/errors/BadRequest'
import Forbidden from '@/utils/errors/Forbidden'
import Unprocessable from '@/utils/errors/Unprocessable'
import { parseId } from '../user/schema'

export default (db: Database) => {
  const messages = buildRepository(db)
  const messagesUser = buildRepositoryUser(db)
  const messageMovie = buildRepositoryMovie(db)
  const router = Router()

  async function getUserRole(userId: number) {
    const user = await messagesUser.getUserById(userId)
    return user?.role
  }

  async function getFreeSeats(screeningId: number) {
    const screening = await messages.getScreeningById(screeningId)
    if (screening) {
      const { capacity } = screening
      const bookedCapacity = capacity
      return capacity - bookedCapacity
    }
    throw new NotFound('Screening with given Id not found')
  }

  router
    .route('/')
    .post(
      jsonRoute(async (req, res) => {
        const authheader: string | undefined = req.headers.authorization
        if (!authheader) {
          throw new BadRequest('Auth data not provided')
        }

        const userId = parseId(authheader)
        if (!userId) {
          throw new BadRequest('User data are missing')
        }

        const userRole = await getUserRole(userId)
        if (userRole === 'admin') {
          const body = schema.parseInsertable(req.body)

          if (new Date(body.date) <= new Date()) {
            throw new BadRequest('Date need to be from future')
          }

          const movies = await messageMovie.findByIds([body.movieId])
          if (isArray(movies) && movies.length === 0) {
            throw new BadRequest('moveId not in the database')
          }

          const screening = await messages.createScreening(body)
          return res.status(201).json(screening)
        }
        throw new Forbidden('User is not admin')
      })
    )
    .get(
      jsonRoute(async (req, res) => {
        const screenings = await messages.getScreenings()

        if (isArray(screenings) && screenings.length === 0) {
          throw new NotFound('Screenings not found')
        }

        res.status(200).json(screenings)
      })
    )
    .patch(unsupportedRoute)
    .put(unsupportedRoute)
    .delete(unsupportedRoute)

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req, res) => {
        const id = schema.parseId(req.params.id)

        const screening = await messages.getScreeningById(id)

        if (!screening) {
          throw new NotFound('Screening with given Id not found')
        }

        res.status(200).json(screening)
      })
    )
    .delete(
      jsonRoute(async (req, res) => {
        const authheader: string | undefined = req.headers.authorization
        if (!authheader) {
          throw new BadRequest('Auth data not provided')
        }

        const userId = parseId(authheader)
        const screeningId = schema.parseId(req.params.id)

        if (!userId) {
          throw new BadRequest('User data are missing')
        }

        const freeSeats = await getFreeSeats(screeningId)

        if (freeSeats !== 0) {
          throw new Unprocessable('screening has still free seats')
        }

        const userRole = await getUserRole(userId)
        if (userRole === 'admin') {
          const screening = await messages.delete(screeningId)

          if (!screening) {
            throw new NotFound('Screening with given Id not found')
          }

          return res.status(200).json(screening)
        }
        throw new Forbidden('User is not admin')
      })
    )

  return router
}
