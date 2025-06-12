import env from './env'

describe('env', () => {
  it('should be defined', () => {
    expect(env).toBeDefined()
  })

  it('should have the correct properties', () => {
    expect(env).toEqual({
      appName: 'time-registration',
      env: 'test',
      version: expect.stringMatching(/^\d+\.\d+\.\d+$/),
      host: expect.any(String),
      port: expect.any(String),
    })
  })
})
