<template>
  <Directory
    class="dark"
    bgImage="url('https://www.fueluponthis.com/assets/img/patterns/dark-teal.svg')"
  >
    <template #page-header>
      <Header class="v2">
        <template>
          HeartbeatATL
        </template>
        <template #support>
          <p class="dark">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam enim
            consequatur iusto assumenda unde, perferendis fugiat porro
            excepturi, ut est praesentium quo sequi hic veritatis similique.
            Deserunt dolorum delectus nulla!
            <br/>
            <button v-on:click="askForLocation">Send Location</button>
          </p>
        </template>
      </Header>
    </template>

    <PageSection class="narrow">
      <template #title>
        Project Statement
      </template>

      <template #support>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
          consequuntur sit odio, sed autem expedita magnam aut facilis minus.
          Optio expedita totam repellat nulla doloribus atque provident neque
          mollitia fuga?
        </p>
        <a href="/project-info">Read more</a>
      </template>
    </PageSection>
  </Directory>
</template>

<script>

  export default {
    name: "Index",
    methods : {
      askForLocation() {
        var startPos;

        var geoSuccess = function(position) {
          // Do magic with location
          startPos = position;
          console.log(startPos);
          document.getElementById('startLat').innerHTML = startPos.coords.latitude;
          document.getElementById('startLon').innerHTML = startPos.coords.longitude;
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

