<template>
  <section class="section">
    <h1>HeartbeatATL</h1>
    <img @click="askForLocation" class="heart" src="~/assets/img/heart.png"/>
    <div>
      {{location.lat + "  " + location.lon}}
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      location: {
        lat: null,
        lon: null
      }
    }
  },
  methods : {
    askForLocation() {
      var startPos;
      console.log(this.location.lat);
      var t = this;

      var geoSuccess = function(position) {
        startPos = position;
        t.location.lat = startPos.coords.latitude;
        t.location.lon = startPos.coords.longitude;
      };

      var geoError = function(error) {
        switch(error.code) {
          case error.TIMEOUT:
            console.log(error);
            break;
        }
      };

      navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    }
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
