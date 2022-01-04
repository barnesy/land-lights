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
    let id = Date.now()
    ws.id = id

    const ip = req.socket.remoteAddress

    console.log(`Socket connected (${ip})`)
    const data = { message: 'Hello from server',
                   id: id
                  }
    ws.send(JSON.stringify(data), (error) => {
      console.log(`Socket sent (${ip})`)
      if (error) {
        console.log(`${error}`)
      }
    })

    ws.on('close', (code, reason) => {
      console.log(`Socket closed (${ip}) ${code} ${reason.toString('utf8')}`)
    })

    ws.on('error', (error) =>
      console.error(`Socket error (${ip}) ${error}`))

    ws.on('message', (data) => {
      data = JSON.parse(data)
      console.log(`Socket received:\n${prettify(data)}`)

      if ('position' in data) {
        ws.lnglat = [data.position.coords.longitude, data.position.coords.latitude ]

        var response = {
          me: {id: ws.id, lnglat: ws.lnglat},
          users: [],
          bounds: []
        }

        let allLngCoords = []
        allLngCoords.push(-84.3957530)
        let allLatCoords = []
        allLatCoords.push(33.7550732)

        for (const client of wss.clients) {
          if(client.lnglat){
            response.users.push({id: client.id, lnglat: client.lnglat})
            allLngCoords.push(client.lnglat[0])
            allLatCoords.push(client.lnglat[1])
          }
        }

        let maxLng = Math.max.apply(Math, allLngCoords);
        let maxLat = Math.max.apply(Math, allLatCoords);

        let ne = [Math.max.apply(Math,allLngCoords), Math.max.apply(Math, allLatCoords)]
        let sw = [Math.min.apply(Math,allLngCoords), Math.min.apply(Math,allLatCoords)]

        response.bounds = [ne, sw]
        console.log(response.bounds)

        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(response))
          }
        }
      }
    })
  })

  wss.on('error', (error) =>
    console.error(`Socket error\n${error}`))
}
