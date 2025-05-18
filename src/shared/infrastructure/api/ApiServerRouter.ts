import type { Hono } from 'hono'

export interface ApiServerRouter {
  app: Hono
}
