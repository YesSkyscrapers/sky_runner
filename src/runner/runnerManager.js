import { createRunner } from './index'
import gateway from '../gateway'

let ports = null
let path = null

let launchedInstance = []
let indexForNextStart = null
let indexForCurrentRun = null

const init = async (_ports, _path) => {
    ports = _ports
    path = _path
    if (!indexForNextStart) {
        indexForNextStart = 0
    }
    if (!indexForCurrentRun) {
        indexForCurrentRun = 0
    }

    ports.forEach((port, index) => {
        launchedInstance[index] = null
    })

    let indexForRun = indexForNextStart
    indexForNextStart = indexForNextStart + 1
    if (indexForNextStart >= ports.length) {
        indexForNextStart = 0
    }

    indexForCurrentRun = indexForRun
    launchedInstance[indexForRun] = createRunner({
        path,
        port: ports[indexForRun]
    })

    let runner = launchedInstance[indexForRun]
    await runner.run()
    gateway.switchToPort(ports[indexForRun])
}

const runNewInstance = async () => {
    let currentRunner = launchedInstance[indexForCurrentRun]

    let indexForRun = indexForNextStart
    indexForNextStart = indexForNextStart + 1
    if (indexForNextStart >= ports.length) {
        indexForNextStart = 0
    }

    indexForCurrentRun = indexForRun
    launchedInstance[indexForRun] = createRunner({
        path,
        port: ports[indexForRun]
    })

    let runner = launchedInstance[indexForRun]
    await runner.run()
    gateway.switchToPort(ports[indexForRun])
    await currentRunner.stop()
}

export default {
    init,
    runNewInstance
}
