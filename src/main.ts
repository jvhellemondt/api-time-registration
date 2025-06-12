import env from './config/env'
import { composeRoot } from './config/root'
import { invariant } from './shared/utils/invariant/invariant'
import { terminate } from './shared/utils/terminate/terminate'

const root = composeRoot({ env })

invariant(!!root, terminate(new Error('Root is not defined')))
