import process from 'node:process'
import { fail, invariant } from '@arts-n-crafts/ts'

const MONGODB_USER = process.env.MONGODB_USER
invariant(Boolean(MONGODB_USER), fail(new Error('Config::mongodb > MONGODB_USER env not set')))
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
invariant(Boolean(MONGODB_PASSWORD), fail(new Error('Config::mongodb > MONGODB_PASSWORD env not set')))
const MONGODB_HOST = process.env.MONGODB_HOST
invariant(Boolean(MONGODB_HOST), fail(new Error('Config::mongodb > MONGODB_HOST env not set')))
const MONGODB_DBNAME = process.env.MONGODB_DBNAME
invariant(Boolean(MONGODB_DBNAME), fail(new Error('Config::mongodb > MONGODB_DBNAME env not set')))
const MONGODB_QUERYPARAMS = process.env.MONGODB_QUERYPARAMS

export const uri = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DBNAME}?${MONGODB_QUERYPARAMS}`
