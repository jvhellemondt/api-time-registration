import { getClient } from '@modules/infrastructure/database/mongo'

let client: Awaited<ReturnType<typeof getClient>>

beforeAll(async () => {
  client = await getClient()
})

afterAll(async () => {
  await client.close()
})
