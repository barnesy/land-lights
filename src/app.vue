<template>
  <div id="flash" class="flash black" :class="{active: this.active}"></div>
  <!-- <div class="flash yellow" :class="{active: isObserving}"></div> -->
  <!-- <div class="flash red" :class="{active: isObserving}"></div> -->


  <section class="section">
    <div id="logo" class="shimmer-color"><img src="~/assets/img/heartbeat-logo.png" /></div>
    <div @click="observe"  class="heart-shaped-box">
      <img id="heart" :class="{enlarged: active}" class="heart shimmer" src="~/assets/img/heart.png"/>
    </div>


    <p class="message">
      [ Tap to connect to ATL's HEARTBEAT ]
      <span class="coords" v-if="position">{{position.coords.longitude}}, {{position.coords.latitude}}</span>
      <span class="error" v-if="error">{{ error.message }}</span>
    </p>

    <p class="centennial-yards">
      <a href="https://goo.gl/maps/zrixjYeWEGbsYZEZ6"><img class="centennial-yards-logo" src="~/assets/img/centennial-yards-logo.png" /></a>
    </p>

    <p class="contributions">With Contributions from many ATL artists @</p>
    <ul>
      <li>Dash.Studio</li>
      <li>*</li>
      <li>Zoo as Zoo</li>
      <li>*</li>
      <li>Arrrtaddict</li>
      <li>*</li>
      <li>Protect Awesome</li>
      <li>*</li>
      <li>Holllidaayyy</li>
    </ul>
  </section>
  <section>
    <Map ref="map" />
  </section>

  <div class="success" :class="{didShare: didShareHeartbeat}">
    <p>You've shared your heartbeat with Atlanta. Thank you!</p>
    <a class="reload-button" href="http://heartbeatatl.com/">Tap HERE to light up the heartbeat again</a>
  </div>

</template>

<script>
import { GeoObserver } from './geo-observer.js'
import { clonePosition }from './clone-position.js'
import { prettify } from './prettify.js'
import {Howl, Howler} from 'howler';
import soundWebmPath from './assets/media/heartbeat.webm'
import soundMp3Path from './assets/media/heartbeat.mp3'
import soundWavPath from './assets/media/heartbeat.wav'

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
      active: false,
      didShareHeartbeat: false
    }
  },
  methods: {
    observe(){
      this.observer.observe()
      this.active = true
      let duration = 30000

      var sound = new Howl({
        src: [
          soundWebmPath,
          soundMp3Path,
          soundWavPath
        ],
        autoplay: true,
        loop: true,
        volume: 1,
        onend: function() {
          console.log('Finished!');
        }
      });

      setTimeout( function() {
        document.getElementById("flash").classList.remove("black");
        document.getElementById("flash").classList.add("yellow");
      }, 2000)

      setTimeout( function() {
        document.getElementById("flash").classList.remove("yellow");
        document.getElementById("flash").classList.add("red");
      }, 5000)

      setTimeout(() => this.active = false , duration)
      setTimeout(() => this.didShareHeartbeat = true , duration)
      setTimeout( function() {
        sound.pause()
        sound.currentTime = 0
      }, duration)
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

#logo {

}

.flash {
  animation-duration: 1s;
  animation-delay: 0.75s;
  animation-iteration-count: infinite;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 1;
  pointer-events: none;
  transition: opacity, 3s ease-out;

  opacity: 0;
  display: block;

  &.active {
    opacity: 0.9;
    pointer-events: all;
  }
}

.black {
  animation-name: black;
}

.yellow {
  animation-name: yellow;
}

.red {
  animation-name: red;
}

@keyframes black {
  0% {
    background-color: #000000;
  }
  30% {
    background-color: #000000;
  }
  40% {
    background-color: #000000;
  }
  55% {
    background-color: #00000096;
  }
  70% {
    background-color: #000000;
  }
  80% {
    background-color: #00000096;
  }
  100% {
    background-color: #000000;
  }
}

@keyframes yellow {
  0% {
    background-color: #f3da5eb7;
  }
  30% {
    background-color: #f3da5eb7;
  }
  40% {
    background-color: #fff3b6b2;
  }
  55% {
    background-color: #f3da5eb7;
  }
  70% {
    background-color: #fff3b6b2;
  }
  80% {
    background-color: #f3da5eb7;
  }
  100% {
    background-color: #f3da5eb7;
  }
}

@keyframes red {
  0% {
    background-color: #b60101a1;
  }
  30% {
    background-color: #b60101a1;
  }
  40% {
    background-color: #fd00008e;
  }
  55% {
    background-color: #b60101a1;
  }
  70% {
    background-color: #fd00008e;
  }
  80% {
    background-color: #b60101a1;
  }
  100% {
    background-color: #b60101a1;
  }
}

.success{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  text-align: center;
  font-size: 1.8rem;
  display: block;
  opacity: 0;
  pointer-events: none;
  line-height: 1.4;

  p {
    padding:1rem 6rem;
  }

  &.didShare {
    display: block;
    opacity: 1;
    pointer-events: all;
  }
}

a.reload-button {
  background: linear-gradient(#3B004B, #9F4A32);
  width: 100%;
  height: 10rem;
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  padding: 6rem;
  box-sizing: border-box;
  text-decoration: none;
}

#logo img{
  width: 100%;
  padding:0 2rem;
  height: 6rem;
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
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 3rem 3rem 0.6rem;
  flex-shrink: 0;

  .centennial-yards {
    display: flex;

    a {
      display: block;
      margin: 0 1rem 0;
      color: white;
      text-decoration: none;

      img {
        max-width: 30rem;
        margin-bottom: -4rem;
      }
    }
  }
}

.message {
  margin-top: -5rem;
  margin-bottom: 4rem;
  font-size: 1.2rem;
  text-align: center;
  opacity: 0.6;
  font-weight: bold;
  max-width: 26rem;
  line-height: 2rem;

  .error {
    color: red;
  }
}

.contributions {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.05rem;
  margin-bottom: 2rem;
  max-width: 24rem;
  line-height: 1;
  text-align: center;
  opacity: 0.7;
}

ul {
  list-style: none;
  font-size: 1rem;
  font-weight: bold;
  padding: 0;
  text-align: center;
  line-height: .6;
  margin-bottom: 3rem;

  li {
    margin:0.6rem 1rem;
    min-width: 7rem;
    letter-spacing: 0.05rem;
    display: inline-block;
  }

  li:nth-child(even){
    width: 0.5rem;
    margin: 0;
    min-width: unset;
  }
}

.heart-shaped-box {
  cursor: pointer;
  overflow: visible;
}

.heart {
  display: block;
  height: 38rem;
  width: 100%;
  object-fit: contain;
  margin: -7rem auto 0;
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
}

</style>
