import { z } from 'zod'
import type { User } from '@/database'

type Record = User

const schema = z.object({
  id: z.coerce.number().int().positive(),
  userName: z.string().min(1).max(25),
  role: z.enum(['admin', 'user']),
})

const insertable = schema.omit({
  id: true,
})

const updateable = insertable.partial()

export const parse = (record: unknown) => schema.parse(record)
export const parseId = (record: unknown) => schema.shape.id.parse(record)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdateable = (record: unknown) => updateable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
