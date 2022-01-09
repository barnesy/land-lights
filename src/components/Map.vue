<template>

  <div id="map">This is a map</div>

</template>


<script>
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import heartImagePath from "../assets/img/heart.png"

  export default {
    name: "Map",
    data () {
      return {
        map: null,
        markers: [],
        layers: [],
        center: [-84.3957530, 33.7550732]
      }
    },
    mounted(){
      const maxBounds = [
        [-84.4012877, 33.7526813], // Southwest coordinates
        [-84.3871225, 33.7584805], // Northeast coordinates
      ]

      this.map = new mapboxgl.Map({
        accessToken: 'pk.eyJ1IjoiaWFtYmFybmVzeSIsImEiOiJja3h5dWY1MnkxZDNoMnhyczBjMWtmYWlpIn0.HdQChTFbneRhxHz3JtGEnw',
        container: 'map',
        style: 'mapbox://styles/iambarnesy/ckxyvmtgz1u9m14qi61l753c5',
        center: this.center,
        zoom: 16,
        pitch: 0,
        maxZoom: 17,
        maxBounds: maxBounds,
      })
      this.addMarker(this.center)
      console.log('mounted');
    },
    methods:{
      updateMarkers(users, bounds){
        for (var i = this.markers.length - 1; i >= 0; i--) {
          this.markers[i].remove();
        }

        for (var i = this.layers.length - 1; i >= 0; i--) {
          console.log(this.layers[i])
          this.map.removeLayer(this.layers[i]);
          this.map.removeSource(this.layers[i]);
        }

        this.addMarker(this.center)

        for (var i = users.length - 1; i >= 0; i--){
          this.addMarker(Object.values(users[i].lnglat), users[i].id, true)
        }

        if(bounds){
          this.map.fitBounds(bounds, {
            padding: 50
          });
        }
      },
      addMarker(lnglat, id="center-coords", withLine=false){
        var img = document.createElement('img')
        img.src = heartImagePath
        img.id = id
        img.className = "heart marker shimmer"

        var marker = new mapboxgl.Marker({element: img}).setLngLat(lnglat).addTo(this.map)
        this.markers.push(marker)

        if(withLine){
          this.addLine(this.center, lnglat, id)
        }
      },
      addLine(start, end, id="center-coords"){
        this.map.addSource(String(id), {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
            'type': 'LineString',
            'coordinates': [start, end]
            }
          }
        });

        var layer = this.map.addLayer({
          'id': String(id),
          'type': 'line',
          'source': String(id),
          'layout': {
          'line-join': 'round',
          'line-cap': 'round'
          },
          'paint': {
          'line-color': '#9959E5',
          'line-width': 3
          }
        });

        this.layers.push(String(id))
      }
    }
  }
</script>

<style>
  #map {
    background: white;
    width: 100%;
    min-height: 40rem;
  }

  .heart.marker {
    height: 10rem;
    width: 12rem;
  }
</style>
