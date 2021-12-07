<template>
  <section class="section">
    <h1>HeartbeatATL</h1>
    <img @click="start" class="heart" src="~/assets/img/heart.png"/>
    <pre v-if="position">{{ JSON.stringify(position, null, 2) }}</pre>
    <pre v-if="error">{{ error.message }}</pre>
  </section>
</template>

<script>
import { onUnmounted, ref } from 'vue'
import { GeoObserver } from './geo-observer.js'

export default {
  setup() {
    const position = ref(null)
    const error = ref(null)
    const update = (_position, _error) => {
      position.value = _position
      error.value = _error
      if (_error) console.error(_error)
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
