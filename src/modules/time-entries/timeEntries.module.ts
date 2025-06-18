import { timeEntriesRouter } from '@/modules/time-entries/infrastructure/rest/router.ts'

function build({ messageStore }: any) {
  console.log({ messageStore })

  function start() {

  }

  return {
    router: timeEntriesRouter,
  }
}

export default build
