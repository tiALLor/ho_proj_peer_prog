import { Router } from 'express'
import type { Database } from '@/database'
import * as schema from './schema'
import { jsonRoute, unsupportedRoute } from '@/utils/middleware'
import buildRepository from './repository'
import NotFound from '../../utils/errors/NotFound'

export default (db: Database) => {
  const messages = buildRepository(db)
  const router = Router()

  router
    .route('/')
    .post(
      jsonRoute(async (req, res) => {
        const body = schema.parseInsertable(req.body)

        const user = await messages.createUser(body)
        res.status(201).json(user)
      })
    )
    .get(unsupportedRoute)
    .patch(unsupportedRoute)
    .put(unsupportedRoute)
    .delete(unsupportedRoute)

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req, res) => {
        const id = schema.parseId(req.params.id)

        const user = await messages.getUserById(id)

        if (!user) {
          throw new NotFound('User with given ID not found')
        }

        res.status(200).json(user)
      })
    )
    .post(unsupportedRoute)
    .patch(unsupportedRoute)
    .put(unsupportedRoute)
    .delete(unsupportedRoute)

  return router
}
