import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvY29vcmVvIiwiYSI6ImNrdDgxZG5ibzB4dGkycGxqZmU0YnNuMzEifQ.smJZQqkcsSI_Su9WCxbQvQ'

export default function MapDataDownload() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-87.661557);
  const [lat, setLat] = useState(41.893748);
  const [zoom, setZoom] = useState(10);
  //INIT MAP
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/examples/cjgiiz9ck002j2ss5zur1vjji',
    center: [lng, lat],
    zoom: zoom
    });
  });

  //POPUP
  useEffect(() => {
    if(!map.current) return;
    map.current.on('click', 'chicago-parks', (e) => {
      const coordinate = e.features[0].geometry.coordinates
      const title = e.features[0].properties.title
      const desc = e.features[0].properties.description
      
      new mapboxgl.Popup()
      .setLngLat(coordinate).setHTML(
        `<h3>${title}</h3>
        <p>${desc}</p>
        `
      ).addTo(map.current);
    });
    map.current.on('mouseenter', 'chicago-parks', () => {
      map.current.getCanvas().style.cursor = 'pointer';
      });
       
      // Change it back to a pointer when it leaves.
      map.current.on('mouseleave', 'chicago-parks', () => {
      map.current.getCanvas().style.cursor = '';
      });
  })
  
  return (
    <>
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
    </>
  );
};