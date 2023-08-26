import * as http from 'http'
import * as httpProxy from 'http-proxy'
import logsManager from '../logsManager'

let proxy = null
let server = null
let portFrom = null
let portTo = null

const redirectHandler = () => {
    return (request, response) => {
        proxy.web(
            request,
            response,
            {
                target: `http://localhost:${portTo}${request.url.slice(request.url.indexOf('/'))}`,
                ignorePath: true,
                changeOrigin: true
            },
            (error) => {
                console.log(`Proxy error: ${error.message} for url ${request.url}`)
                response.writeHead(503, { 'Content-Type': 'text/plain' })
                response.write('Service unavailable')
                response.end()
            }
        )
    }
}

const init = (_portFrom, _portTo) => {
    portFrom = _portFrom
    portTo = _portTo
    logsManager.append(`Gateway route switched to ${portTo}`)
    proxy = httpProxy.createProxyServer({})
    server = http.createServer(redirectHandler())
}

const start = async () => {
    return await new Promise((resolve, reject) => {
        server.listen(portFrom, (error) => {
            if (error) {
                reject(`Gateway listen error: ${error}`)
            } else {
                console.log('Gateway started. Listen -', portFrom)
                resolve()
            }
        })
    })
}

const stop = async () => {
    return await new Promise((resolve, reject) => {
        server.close(() => {
            resolve(null)
        })
    })
}

const switchToPort = (_port) => {
    portTo = _port
    logsManager.append(`Gateway route switched to ${portTo}`)
}

export default {
    init,
    start,
    stop,
    switchToPort
}
