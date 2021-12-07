import { Server } from 'socket.io'
import { prettify } from '../..//prettify.js'

let io = null

export default async (req, res) => {

  if (io) return

  console.log('Starting socket server')
  io = new Server(res.socket.server)

  io.on('connection', (socket) => {
    console.log(`Socket connected (${socket.id})`)

    socket.on('ping', (data) => {
      console.log(`Socket received 'ping' (${socket.id})\n${prettify(data)}`)
      socket.emit('pong', data)
    })

    socket.on('disconnect', (socket) =>
      console.log(`Socket disconnected (${socket.id})`))
  })
}
