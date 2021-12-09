<template>
  <section class="section">
    <h1>HeartbeatATL</h1>
    <img @click="start" class="heart" src="~/assets/img/heart.png"/>
    <pre v-if="position">{{ JSON.stringify(position, null, 2) }}</pre>
    <pre v-if="error">{{ error.message }}</pre>
  </section>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import { GeoObserver } from './geo-observer.js'
import { prettify } from './prettify.js'

export default {
  setup() {

    const position = ref(null)
    const error = ref(null)

    let socket
    const startSocket = () => {
      console.debug(`Opening socket...`)
      socket = new WebSocket(`ws://${window.location.hostname}:3001/ws`);
      socket.onopen = () => {
        console.debug(`Socket connected`)
        const data = { message: 'Hello from client' }
        socket.send(JSON.stringify(data))
      }
      socket.onerror = console.error
      socket.onclose = () => {
        console.debug('Socket disconnected')
      }
      socket.onmessage = ({ data }) => {
        data = JSON.parse(data)
        console.debug(`Socket received:\n${prettify(data)}`)
        if ('position' in data) {
          position.value = data.position
        }
      }
    }
    onMounted(startSocket)

    const stopSocket = () => socket.close(1001)
    onUnmounted(stopSocket)


    const update = (position, _error) => {
      if (!_error)
        socket.send(JSON.stringify({ position }))
      else {
        error.value = _error
        console.error(_error)
      }
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
