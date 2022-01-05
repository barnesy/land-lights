<template>

  <section class="section">
    <div id="logo" class="shimmer-color"><img src="~/assets/img/heartbeat-logo.png" /></div>
    <div @click="observe"  class="heart-shaped-box">
      <img id="heart" :class="{enlarged: isObserving}" class="heart shimmer" src="~/assets/img/heart.png"/>
    </div>
    <!-- <pre v-if="position">{{ JSON.stringify(position, null, 2) }}</pre> -->
    <pre v-if="error">{{ error.message }}</pre>

    <p class="links">
      <a href="https://goo.gl/maps/zrixjYeWEGbsYZEZ6"><img src="~/assets/img/centennial-yards-logo.png" /></a>
    </p>
  </section>
  <section>
    <Map ref="map" />
  </section>

</template>

<script>
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
      observer: null,
      isObserving: false
    }
  },
  methods: {
    observe(){
      this.observer.observe()
      this.isObserving = true
    },
    updateMap(users, bounds){
      this.$refs.map.updateMarkers(users, bounds)
    },
    update(position, error) {
      console.log('on update')

      if (!error) {
        console.log(position)
        position = clonePosition(position) // fix stringify
        this.position = position
        this.socket.send(JSON.stringify({ position }))
        this.observer.disconnect()
      } else {
        console.error(error)
        this.error = error
      }
    }
  },
  mounted() {
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
      data = JSON.parse(data)

      console.debug(`Socket received:\n${prettify(data)}`)
      if ('users' in data) {
        this.updateMap(data.users, data.bounds)

        window.scrollTo(0,document.body.scrollHeight)
      }
    }

    this.observer = new GeoObserver(this.update)
  },
  unmounted(){
    console.log('unmounted')
    this.observer.disconnect()
    this.socket.close(1001)
  }
};

</script>

<style lang="scss">

body {
  background-color: #330C42;
  color: white;
}

#logo img{
  width: 100%;
  padding:0 2rem;
  height: 12rem;
  box-sizing: border-box;
  object-fit: contain;
  max-width: 50rem;
}

.section {
  align-items: center;
  background-image: url('./assets/img/bg.png');
  background-position: top;
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

.heart-shaped-box {
  cursor: pointer;
  overflow: hidden;
}

.heart {
  height: 34rem;
  width: 100%;
  object-fit: contain;
  margin: 0 auto;
  transition: ease-in-out 150ms;
  pointer-events: none;
}

.enlarged {
  transform: scale(1.1);
  transition: all 400ms cubic-bezier(.47,1.64,.41,.8);
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
