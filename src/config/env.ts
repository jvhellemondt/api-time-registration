import process from 'node:process'
import colors from 'colors/safe'

import { invariant } from '@/shared/utils/invariant/invariant'
import { terminate } from '@/shared/utils/terminate/terminate'
import packageJson from '../../package.json'

function requireFromEnv(key: string) {
  invariant(!!process.env[key], terminate(new Error(`${colors.red('[APP ERROR] Missing env variable:')} ${key}`)))
  return process.env[key]
}

export default {
  appName: packageJson.name,
  version: packageJson.version,
  env: requireFromEnv('NODE_ENV'),
}
