import express from 'express'
import jsonErrorHandler from './middleware/jsonErrors'
import { type Database } from './database'
import movies from '@/modules/movies/controller'
import user from '@/modules/user/controller'
import screening from '@/modules/screening/controller'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function createApp(db: Database) {
  const app = express()

  app.use(express.json())

  // register your controllers here
  app.use('/movies', movies(db))

  app.use('/user', user(db))

  app.use('/screening', screening(db))

  app.use(jsonErrorHandler)

  return app
}
