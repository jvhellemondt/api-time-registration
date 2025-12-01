import { uri } from './mongodb'

export interface Config {
  mongodb: {
    uri: string
  }
}

export const config = {
  mongodb: {
    uri,
  },
}
