import * as http from 'http'
import logsManager from '../logsManager'
import runnerManager from '../runner/runnerManager'

let server = null
let port = null

const init = (_port) => {
    port = _port
    return new Promise((resolve) => {
        server = http.createServer(listener)

        server.listen(port, (error) => {
            console.log('Control started. Listen -', port)
            resolve()
        })
    })
}

const listener = async (request, response) => {
    let handlerName = request.url.slice(1, request.url.includes('?') ? request.url.indexOf('?') : request.url.length)

    switch (handlerName) {
        case 'read': {
            response.write(await logsManager.read())
            response.end()
            break
        }
        case 'hook': {
            let body = []
            request
                .on('data', (chunk) => {
                    body.push(chunk)
                })
                .on('end', () => {
                    body = Buffer.concat(body).toString()

                    logsManager.append(body)
                    response.writeHead(200)
                    response.end()
                })

            break
        }
        case 'rebuildSync': {
            await runnerManager.runNewInstance()
            response.writeHead(200)
            response.end()
            break
        }
        case 'rebuild': {
            runnerManager.runNewInstance()
            response.writeHead(200)
            response.end()
            break
        }
        case 'clear': {
            await logsManager.clear()
            response.writeHead(200)
            response.end()
            break
        }
        default: {
            response.writeHead(200)
            response.end()
        }
    }
}

export default {
    init
}
