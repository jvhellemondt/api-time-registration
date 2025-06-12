import process from 'node:process'
import { terminate } from './terminate'

describe('terminate (with Error parameter)', () => {
  // suppress the error logging to prevent console output during tests
  const logSpy = vitest.spyOn(console, 'error').mockImplementation(() => {
    return '' as never
  })
  const exitSpy = vitest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('Mocked error')
  })

  it('should exit the process', () => {
    const errorMessage = 'This is an expected error message!'
    const errorInstance = new Error(errorMessage)
    expect(terminate(errorInstance)).toThrow()
    expect(logSpy).toHaveBeenCalledOnce()
    expect(exitSpy).toHaveBeenCalledOnce()
  })
})
