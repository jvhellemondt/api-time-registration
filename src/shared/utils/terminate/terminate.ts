import process from 'node:process'

export function terminate(anExpression: Error) {
  return () => {
    console.error(anExpression)
    process.exit(1)
  }
}
