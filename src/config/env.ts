import type { Environment } from '@/shared/core/Environment'

import colors from 'colors/safe'
import { invariant } from '@/shared/utils/invariant/invariant'
import { terminate } from '@/shared/utils/terminate/terminate'
import packageJson from '../../package.json'

function requireFromEnv(key: string) {
  invariant(!!import.meta.env[key], terminate(new Error(`${colors.red('[APP ERROR] Missing env variable:')} ${key}`)))
  return import.meta.env[key]
}

const environment: Environment = {
  appName: packageJson.name,
  version: packageJson.version,
  env: requireFromEnv('NODE_ENV'),
  host: requireFromEnv('HOST'),
  port: requireFromEnv('PORT'),
}

export default environment
