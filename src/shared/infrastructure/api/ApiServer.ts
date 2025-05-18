import type { ApiServerRouter } from './ApiServerRouter'
import { Hono } from 'hono'

export class ApiServer {
  private readonly _app: Hono

  constructor(...routers: ApiServerRouter[]) {
    this._app = new Hono()

    this._app.get('/health', c => c.text('OK'))
    routers.forEach((router) => {
      this._app.route('/', router.app)
    })
  }

  serve() {
    return this._app
  }
}
