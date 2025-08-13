export function mapMongoIdToId<T extends { _id: string }>({ _id, ...rest }: T) {
  return ({ id: _id, ...rest })
}

export function mapIdToMongoId<T extends { id: string }>({ id, ...rest }: T) {
  return ({ _id: id, ...rest })
}
