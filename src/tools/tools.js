import fs from 'fs/promises'
import { spawn } from 'child_process'

const fileExists = async (path) => {
    try {
        let fileInfo = await fs.stat(path)
        return !!fileInfo
    } catch (err) {
        return false
    }
}

const runCommand = ({ command, cwd, onLog }) => {
    return new Promise((resolve) => {
        if (command.split(' ').length == 1) {
            process = spawn(command, {
                cwd
            })
        } else {
            process = spawn(command.split(' ')[0], command.split(' ').slice(1, command.split(' ').length), {
                cwd
            })
        }

        process.stdout.on('data', (data) => {
            if (onLog) {
                onLog(`${data}`.trim())
            }
        })

        process.stderr.on('data', (data) => {
            if (onLog) {
                onLog(`${data}`.trim())
            }
        })

        process.on('close', (code) => {
            resolve(code)
        })
    })
}

export { fileExists, runCommand }
