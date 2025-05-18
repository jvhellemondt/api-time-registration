import { HTTPException } from 'hono/http-exception'

export function handleException(err: unknown): Response {
  if (err instanceof HTTPException)
    return err.getResponse()
  return new Response('Unhandled exception', { status: 500 })
}
