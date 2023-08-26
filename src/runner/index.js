import logsManager from '../logsManager'
import { spawn } from 'child_process'
import { runCommand } from '../tools/tools'

let index = 0

const createRunner = (params) => {
    let _index = index
    index = index + 1

    let process = null
    let isStarted = false

    const run = () => {
        return new Promise(async (resolve) => {
            logsManager.append(`process ${_index} spawned.`)

            const onLog = (log) => {
                logsManager.append(`process ${_index} (git): ${log}`)
            }

            await runCommand({
                command: 'git reset',
                cwd: params.path,
                onLog
            })

            await runCommand({
                command: 'git fetch',
                cwd: params.path,
                onLog
            })

            await runCommand({
                command: 'git checkout .',
                cwd: params.path,
                onLog
            })

            await runCommand({
                command: 'git clean -fdx',
                cwd: params.path,
                onLog
            })

            await runCommand({
                command: `git checkout master`,
                cwd: params.path,
                onLog
            })

            await runCommand({
                command: `git pull`,
                cwd: params.path,
                onLog
            })

            await runCommand({
                command: `yarn`,
                cwd: params.path,
                onLog
            })

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
                logsManager.append(`process ${_index} (out): ${`${data}`.trim()}`)
            })

            process.stderr.on('data', (data) => {
                logsManager.append(`process ${_index} (err): ${`${data}`.trim()}`)
            })

            process.on('close', (code) => {
                logsManager.append(`process ${_index} (close): ${code}`)
            })
        })
    }

    const stop = () => {
        logsManager.append(`process ${_index} killed.`)
        process.kill(0)
    }

    return {
        index: _index,
        run,
        stop
    }
}

export { createRunner }

/*
    { value: , cwd: '|||PROJECT_DIR|||' },
        { value: , cwd: '|||PROJECT_DIR|||' },
        { value: , cwd: '|||PROJECT_DIR|||' },
        { value: , cwd: '|||PROJECT_DIR|||' },
        {
            value: `git checkout ${buildParams.branchName ? buildParams.branchName : 'develop'}`,
            cwd: '|||PROJECT_DIR|||'
        },
        { value: `git pull`, cwd: '|||PROJECT_DIR|||' },
*/
