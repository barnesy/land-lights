<template>
  <PageSection
    class="dark"
    bgColor="var(--red)"
    :bgImage="`url('${bgImageURL}')`"
  >
    <Header class="v2">
      <template>
        HeartbeatATL

        <img v-on:click="askForLocation" class="heart" src="~/assets/img/heart.png" width="150" height="150" />
      </template>
      <template #support>
        {{location.lat + "  " + location.lon}}
      </template>

    </Header>

  </PageSection>
</template>

<script>
import Header from '@gas-digital/components/lib/Header.vue';
import PageSection from '@gas-digital/components/lib/PageSection.vue';
import bgImageURL from '~/assets/img/bg.jpg';

  export default {
    name: "Index",
    components: {
      Header,
      PageSection
    },
    data() {
      return {
        bgImageURL,
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
.page-section {
  min-height: 90rem;
}

.v2 .header .support {
  text-align: center;
}

.heart {
  margin: 0 auto;
  height: 24rem;
  width: 24rem;
  cursor: pointer;
}
</style>
