import control from './control'
import getParams from './functions/getParams'
import gateway from './gateway'
import logsManager from './logsManager'
import runnerManager from './runner/runnerManager'

const runApp = async () => {
    let params = await getParams()

    await logsManager.init()
    console.log('Logs Manager inited.')
    logsManager.append(`App run.`)

    await control.init(Number(params.controlPort))
    console.log('Control inited.')

    await runnerManager.init([Number(params.reservedRoutePort1), Number(params.reservedRoutePort2)], params.targetPath)
    console.log('Instance inited.')

    gateway.init(Number(params.gateWayPort), Number(params.reservedRoutePort1))
    console.log('Gateway inited.')
    await gateway.start()
    console.log('Gateway started.')
}

export default runApp
