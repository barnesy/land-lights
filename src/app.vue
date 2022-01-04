<template>

  <section class="section">
    <h1 class="shimmer-color">Heartbeat_ATL</h1>
    <img @click="this.observer.observe()" id="heart" class="heart shimmer" src="~/assets/img/heart.png"/>
    <!-- <pre v-if="position">{{ JSON.stringify(position, null, 2) }}</pre> -->
    <pre v-if="error">{{ error.message }}</pre>

    <p class="links">
      <a href="https://goo.gl/maps/9mYazaiXJWCuJVSW6"><img src="~/assets/img/centennial-yards-logo.png" /></a>
    </p>
  </section>
  <section>
    <Map ref="map" />
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
  name: "App",
  head() {
    return {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'my website description'
        }
      ]
    }
  },
  data() {
    return {
      position: null,
      error: null,
      socket: null,
      observer: null
    }
  },
  methods: {
    addMarkerToMap(lnglat){
      console.log(lnglat)
      this.$refs.map.addMarker(lnglat, true);
    },
    update(_position, _error) {
      console.log('on update')
      this.position = _position

      if (!_error) {
        console.log(this.position)
        let position = clonePosition(_position) // fix stringify
        this.socket.send(JSON.stringify({ position }))
      } else {
        error.value = _error
        console.error(_error)
      }
    }
  },
  created(){

  },
  mounted() {
    const error = ref(null)

    console.log('parent mounted')
    console.debug(`Opening socket...`)

    const url = buildSocketURL(window.location)
    this.socket = new WebSocket(url)

    this.socket.onopen = () => {
      console.debug(`Socket connected`)
      const data = { message: 'Hello from client' }
      this.socket.send(JSON.stringify(data))
    }

    this.socket.onerror = console.error

    this.socket.onclose = () => {
      console.debug('Socket disconnected')
    }

    this.socket.onmessage = ({ data }) => {
      console.log('on message')
      data = JSON.parse(data)
      console.log(data)

      console.debug(`Socket received:\n${prettify(data)}`)
      if ('position' in data) {
        this.addMarkerToMap([data.position.coords.longitude, data.position.coords.latitude])

        window.scrollTo(0,document.body.scrollHeight)
      }
    }

    this.observer = new GeoObserver(this.update)
  },
  unmounted(){
    console.log('unmounted')
    this.observer.disconnect()
    this.socket.close(1001)
  },
  setup() {
    return
  }
};

</script>

<style lang="scss">

body {
  background-color: #5D3E6F;
  color: white;
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
  flex-shrink: 0;

  .links {
    display: flex;

    a {
      display: block;
      margin: 0 1rem;
      color: white;
      text-decoration: none;

      img {
        max-width: 20rem;
      }
    }
  }
}

.heart {
  cursor: pointer;
  height: 34rem;
  width: 100%;
  object-fit: contain;
  margin: 0 auto;
  transition: ease-in-out 150ms;
}

.shimmer {
  -webkit-mask:linear-gradient(-60deg,#000 30%,#0005,#000 70%) right/300% 100%;
  background-repeat: no-repeat;
  animation: shimmer 2.5s infinite;
}

.shimmer-color {
  -webkit-mask:linear-gradient(-60deg,rgb(241, 241, 241) 30%,rgba(40, 60, 236, 0.333),rgb(248, 22, 180) 70%) right/300% 100%;
  background-repeat: no-repeat;
  animation: shimmer 5s infinite;
}

@keyframes shimmer {
  100% {-webkit-mask-position:left}
}

@media (max-width: 800px) {
  h1 {
    font-size: 2.2rem;
    color: pink;
    line-height: 2;
    padding: 0;
    margin: 0;
    height: 6rem;
  }

  a, p, h1 {
    color: white;
    border: none;
  }

  .heart {
    max-width: 33rem;
  }

  .section {
    min-height: 70rem;
  }
}

</style>
