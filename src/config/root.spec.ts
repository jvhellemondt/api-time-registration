import { composeRoot } from './root'

describe('composeRoot', () => {
  it('should be defined', () => {
    expect(composeRoot).toBeDefined()
  })

  it('should return an object with the env property', () => {
    const root = composeRoot({ env: 'development' })
    expect(root).toEqual({
      env: 'development',
      aggregators: expect.any(Object),
      components: expect.any(Object),
    })
  })
})
