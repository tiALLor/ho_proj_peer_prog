import type { Insertable, Selectable } from 'kysely'
import { Database, User } from '@/database'
import { keys } from './schema'

const TABLE = 'User'

type Row = User

type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>

type RowSelectable = Selectable<Row>

export default (db: Database) => ({
  // create user
  async createUser(record: RowInsert | RowInsert[]): Promise<RowSelectable[]> {
    const user = await db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .execute()

    return user
  },
  // find user by id
  getUserById(id: number): Promise<RowSelectable | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },

  // find all users
  getUsers(): Promise<RowSelectable[] | undefined> {
    return db.selectFrom(TABLE).select(keys).execute()
  },
})
