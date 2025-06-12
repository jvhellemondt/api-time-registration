import process from 'node:process'
import colors from 'colors/safe'

import { fail } from '@/shared/utils/fail/fail'
import { invariant } from '@/shared/utils/invariant/invariant'
import packageJson from '../../package.json'

function requireFromEnv(key: string) {
  invariant(!!process.env[key], fail(new Error(`${colors.red('[APP ERROR] Missing env variable:')} ${key}`)))
  return process.env[key]
}

export default {
  appName: packageJson.name,
  version: packageJson.version,
  env: requireFromEnv('NODE_ENV'),
}
