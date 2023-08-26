import logsManager from '../logsManager'
import { spawn } from 'child_process'

let index = 0

const createRunner = (params) => {
    let _index = index
    index = index + 1

    let process = null
    let isStarted = false

    const run = () => {
        return new Promise((resolve) => {
            logsManager.append(`processs ${_index} spawned.`)

            let command = `yarn start -port:${params.port}`
            process = spawn(command.split(' ')[0], command.split(' ').slice(1, command.split(' ').length), {
                cwd: params.path
            })

            process.stdout.on('data', (data) => {
                if (!isStarted && `${data}`.includes('started')) {
                    isStarted = true
                    console.log(`Runner ${_index} started. Asked port - ${params.port}`)
                    logsManager.append(`Runner ${_index} started. Asked port - ${params.port}`)
                    resolve()
                }
                logsManager.append(`processs ${_index} (out): ${`${data}`.trim()}`)
            })

            process.stderr.on('data', (data) => {
                logsManager.append(`processs ${_index} (err): ${`${data}`.trim()}`)
            })

            process.on('close', (code) => {
                logsManager.append(`processs ${_index} (close): ${code}`)
            })
        })
    }

    const stop = () => {
        logsManager.append(`processs ${_index} killed.`)
        process.kill(0)
    }

    return {
        index: _index,
        run,
        stop
    }
}

export { createRunner }
