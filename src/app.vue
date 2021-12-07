<template>
  <section class="section">
    <h1>HeartbeatATL</h1>
    <img @click="start" class="heart" src="~/assets/img/heart.png"/>
    <pre v-if="position">{{ JSON.stringify(position, null, 2) }}</pre>
    <pre v-if="error">{{ error.message }}</pre>
  </section>
</template>

<script>
import { io } from 'socket.io-client'
import { onMounted, onUnmounted, ref } from 'vue'
import { GeoObserver } from './geo-observer.js'
import { prettify } from './prettify.js'

export default {
  setup() {

    let socket
    const startSocket = () => {
      socket = io();
      socket.on('connect', () => {
        console.debug(`Socket connected (${socket.id})`)
      });
      socket.on('connect_error', console.error)
      socket.on('disconnect', () => {
        console.debug('Socket disconnected')
      });
      socket.on('pong', (_position) => {
        console.debug(`Socket received 'pong' (${socket.id})\n${prettify(_position)}`)
        position.value = _position
      })
    }
    onMounted(startSocket)

    const stopSocket = () => socket.disconnect()
    onUnmounted(stopSocket)


    const position = ref(null)
    const error = ref(null)
    const update = (_position, _error) => {
      if (!_error)
        socket.emit('ping', _position)
      else
        console.error(_error)
    }
    const observer = new GeoObserver(update)
    const start = () => observer.simulate()
    const stop = () => observer.disconnect()
    onUnmounted(stop)

    return { error, position, start }
  }
};

</script>

<style lang="scss">

.section {
  align-items: center;
  background-color: #EC1C24;
  background-image: url('./assets/img/bg.jpg');
  background-position: center;
  background-size: cover;
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: column;
  min-height: 90rem;
  padding: 3rem 3rem 10rem;
  width: 100%;
}

.heart {
  cursor: pointer;
  height: 24rem;
  margin: 0 auto;
  width: 24rem;
}

</style>
