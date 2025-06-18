import { serve } from 'bun'
import colors from 'colors/safe'
import env from '@/config/env'
import { composeRoot } from '@/config/root'
import createServer from '@/shared/infrastructure/server/server'
import { invariant } from '@/shared/utils/invariant/invariant'
import { terminate } from '@/shared/utils/terminate/terminate'

const modules = {}
const messageStore = {}
const database = {}
const root = composeRoot({ env, modules, messageStore, database })

invariant(!!root, terminate(new Error('Bootstrap failed. Composition root is not defined')))

function signalAppStart(server: ReturnType<typeof serve>) {
  // eslint-disable-next-line no-console
  console.log(`✨ ${colors.rainbow(env.appName)}`)
  // eslint-disable-next-line no-console
  console.table([
    { key: 'Host', value: env.host },
    { key: 'Port', value: env.port },
    { key: 'Environment', value: env.env },
    { key: 'Version', value: env.version },
  ], ['key', 'value'])
  const address = colors.blue(colors.underline(server.url.toString()))
  // eslint-disable-next-line no-console
  console.log(
    colors.green(`Development server started | ${address} | 🚀`),
  )
}

function start() {
  const server = serve(createServer(env))
  signalAppStart(server)
}

export {
  env,
  start,
}
