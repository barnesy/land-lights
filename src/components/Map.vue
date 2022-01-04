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
        markers: null,
        center: [-84.3957530, 33.7550732]
      }
    },
    mounted(){
      const bounds = [
        [-84.5251117, 33.6035027], // Southwest coordinates
        [-84.2002905, 33.9140176], // Northeast coordinates
      ]

      this.markers = []

      this.map = new mapboxgl.Map({
        accessToken: 'pk.eyJ1IjoiaWFtYmFybmVzeSIsImEiOiJja3h5dWY1MnkxZDNoMnhyczBjMWtmYWlpIn0.HdQChTFbneRhxHz3JtGEnw',
        container: 'map',
        style: 'mapbox://styles/iambarnesy/ckxyvmtgz1u9m14qi61l753c5',
        center: this.center,
        zoom: 16,
        pitch: 0,
        maxZoom: 17,
        maxBounds: bounds,
      })
      this.addMarker(this.center)
      console.log('mounted');
    },
    methods:{
      addMarker(latlng, fly=false){
        var img = document.createElement('img')
        img.src = heartImagePath
        img.className = "heart marker shimmer"

        var marker = new mapboxgl.Marker({element: img}).setLngLat(latlng).addTo(this.map)
        this.markers.push(marker)

        if(fly){
          this.map.fitBounds([
            [this.center[0], this.center[1]], // southwestern corner of the bounds
            latlng // northeastern corner of the bounds
          ]);

          this.addLine(this.center, latlng)
        }
        console.log('adding marker')
      },
      addLine(start, end){
        this.map.addSource('route', {
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

        this.map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
          'line-join': 'round',
          'line-cap': 'round'
          },
          'paint': {
          'line-color': '#9959E5',
          'line-width': 3
          }
        });
      }
    }
  }
</script>

<style>
  #map {
    background: white;
    height: 100%;
    width: 100%;
    min-height: 60rem;
  }

  .heart.marker {
    height: 10rem;
    width: 12rem;
  }
</style>
