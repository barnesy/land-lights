import { WebSocket, WebSocketServer } from 'ws'
import { prettify } from '../../prettify.js'

let wss

export default async (req, res) => {

  if (wss) return

  console.log('Starting socket server')
  wss = new WebSocketServer({
    clientTracking: true,
    path: 'ws',
    port: 3001
  })

  wss.shouldHandle = () => true

  wss.on('connection', (ws, req) => {

    const ip = req.socket.remoteAddress

    console.log(`Socket connected (${ip})`)
    const data = { message: 'Hello from server' }
    ws.send(JSON.stringify(data), (error) => {
      console.log(`Socket sent (${ip})`)
      if (error) {
        console.log(`${error}`)
      }
    })

    ws.on('close', (code, reason) =>
      console.log(`Socket closed (${ip}) ${code} ${reason.toString('utf8')}`))

    ws.on('error', (error) =>
      console.error(`Socket error (${ip}) ${error}`))

    ws.on('message', (data) => {
      data = JSON.parse(data)
      console.log(`Socket received:\n${prettify(data)}`)

      if ('position' in data) {
        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data))
          }
        }
      }
    })
  })

  wss.on('error', (error) =>
    console.error(`Socket error\n${error}`))
}
