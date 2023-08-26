import parametrManager from '../parametrManager'

const getParams = async () => {
    await parametrManager.init()

    let parametrs = process.argv.filter((arg, index) => {
        return index > 1 && arg.startsWith('-') && arg.includes('=')
    })

    parametrs = parametrs.map((item) => ({
        name: item.split('=')[0].slice(1, item.split('=')[0].length),
        value: item.split('=')[1]
    }))

    let parametrsForSet = ['gateWayPort', 'reservedRoutePort1', 'reservedRoutePort2', 'targetPath', 'controlPort']

    let savedParametrs = await parametrManager.load()
    console.log('savedParametrs', savedParametrs)

    let currentParams = parametrsForSet.map((param) => {
        let selectedParams = parametrs.find((item) => item.name == param)

        let value = selectedParams ? selectedParams.value : undefined

        if (!value) {
            let selectedSavedParam = savedParametrs.find((item) => item.name == param)
            value = selectedSavedParam && selectedSavedParam.value ? selectedSavedParam.value : undefined
        }

        return {
            name: param,
            value
        }
    })

    let notSetParams = currentParams.filter((item) => {
        return !item.value
    })

    if (notSetParams.length > 0) {
        console.log('Not set params: ', notSetParams.map((i) => i.name).join(' '))
        process.exit(1)
    }

    await parametrManager.save(currentParams)

    let gateWayPort = currentParams.find((item) => item.name == 'gateWayPort').value
    let reservedRoutePort1 = currentParams.find((item) => item.name == 'reservedRoutePort1').value
    let reservedRoutePort2 = currentParams.find((item) => item.name == 'reservedRoutePort2').value
    let targetPath = currentParams.find((item) => item.name == 'targetPath').value
    let controlPort = currentParams.find((item) => item.name == 'controlPort').value

    return {
        gateWayPort,
        reservedRoutePort1,
        reservedRoutePort2,
        targetPath,
        controlPort
    }
}

export default getParams
