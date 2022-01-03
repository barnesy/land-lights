<template>
  <section class="section">
    <h1>Heartbeat_ATL</h1>
    <img @click="start" class="heart shimmer" src="~/assets/img/heart.png"/>
    <!-- <pre v-if="position">{{ JSON.stringify(position, null, 2) }}</pre>
    <pre v-if="error">{{ error.message }}</pre> -->

    <p class="links">
      <a href="https://goo.gl/maps/9mYazaiXJWCuJVSW6">@Centenial Yards</a>
      <a href="https://www.instagram.com/heartbeat_atl">#heartbeatatl</a>
    </p>
  </section>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import { GeoObserver } from './geo-observer.js'
import { clonePosition }from './clone-position.js'
import { prettify } from './prettify.js'

function buildSocketURL(location) {
  const url = new URL('/ws', location)
  url.protocol = url.protocol.replace('http', 'ws')
  url.port = url.port.replace('3000', '3001')
  return url
}

export default {
  setup() {

    const position = ref(null)
    const error = ref(null)

    let socket
    const startSocket = () => {
      console.debug(`Opening socket...`)
      const url = buildSocketURL(window.location)
      socket = new WebSocket(url)
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
      if (!_error) {
        position = clonePosition(position) // fix stringify
        socket.send(JSON.stringify({ position }))
      } else {
        error.value = _error
        console.error(_error)
      }
    }
    const observer = new GeoObserver(update)
    const start = () => observer.observe()
    const stop = () => observer.disconnect()
    onUnmounted(stop)

    return { error, position, start }
  }
};

</script>

<style lang="scss">

body {
  background-color: #cc6f26;
}

.section {
  align-items: center;
  background-color: #EC1C24;
  background-image: url('./assets/img/bg.jpg');
  background-position: bottom;
  background-size: cover;
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: column;
  min-height: 80rem;
  padding: 3rem;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 3rem;

  .links {
    display: flex;

    a {
      display: block;
      margin: 0 1rem;
      color: white;
      text-decoration: none;
    }
  }
}

.heart {
  cursor: pointer;
  height: 34rem;
  width: 34rem;
  margin: 0 auto;
  transition: ease-in-out 150ms;
}

.heart:hover {
  // transform: scale(1.05);
}

.shimmer {
  -webkit-mask:linear-gradient(-60deg,#000 30%,#0005,#000 70%) right/300% 100%;
  background-repeat: no-repeat;
  animation: shimmer 2.5s infinite;
}

@keyframes shimmer {
  100% {-webkit-mask-position:left}
}

@media (max-width: 800px) {
  h1 {
    font-size: 2.4rem;
  }

  .heart {
    height: 28rem;
    width: 28rem;
  }

  .section {
    min-height: 60rem;
  }
}

</style>
