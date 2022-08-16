

mapboxgl.accessToken = mapToken;
console.log(camp.geometry.coordinates);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    //73.4759,18.7102 
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.addControl(new mapboxgl.NavigationControl());
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

const popup = new mapboxgl.Popup({ offset:25 })
.setLngLat(camp.geometry.coordinates)
.setHTML(`<h7>${camp.title}</h7>`)
.addTo(map);

const marker1 = new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
   
            

.addTo(map);

