import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

import data from "./data.geojson"

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvY29vcmVvIiwiYSI6ImNrdDgxZG5ibzB4dGkycGxqZmU0YnNuMzEifQ.smJZQqkcsSI_Su9WCxbQvQ'

export default function MapDataDownload() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(31.4606);
  const [lat, setLat] = useState(20.7927);
  const [zoom, setZoom] = useState(0.5);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  function filterBy(month) {
    const filters = ['==', 'month', month];
    map.current.setFilter('earthquake-circles', filters);
    map.current.setFilter('earthquake-labels', filters);
     
    // Set the label to the month
    document.getElementById('month').textContent = months[month];
  }

  //INIT MAP
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/light-v10',
    center: [lng, lat],
    zoom: zoom
    });

    map.current.addControl(new mapboxgl.NavigationControl());
  });

  //
  useEffect(() => {
    if(!map.current) return;
    map.current.on('load', async () => {
      const datageojson = await (await fetch(data)).json();
      datageojson.features = datageojson.features.map((d) => {
        d.properties.month = new Date(d.properties.time).getMonth();
        return d;
      })

      map.current.addSource('earthquakes', {
        'type': 'geojson',
        data: datageojson
        });
         
        map.current.addLayer({
          'id': 'earthquake-circles',
          'type': 'circle',
          'source': 'earthquakes',
          'paint': {
          'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'mag'],
          6,
          '#FCA107',
          8,
          '#7F3121'
          ],
          'circle-opacity': 0.75,
          'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'mag'],
          6,
          20,
          8,
          40
          ]
          }
        });
         
        map.current.addLayer({
          'id': 'earthquake-labels',
          'type': 'symbol',
          'source': 'earthquakes',
          'layout': {
          'text-field': ['concat', ['to-string', ['get', 'mag']], 'm'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12
          },
          'paint': {
          'text-color': 'rgba(0,0,0,0.5)'
          }
        });
         
        // Set filter to first month of the year
        // 0 = January
        filterBy(0);
         
        document.getElementById('slider').addEventListener('input', (e) => {
          const month = parseInt(e.target.value, 10);
          filterBy(month);
        });
    });

  })
  
  return (
    <>
    <div>
      <div ref={mapContainer} className="map-container" />
      <div class="map-overlay top">
        <div class="map-overlay-inner">
          <h2>Significant earthquakes in 2015</h2>
          <label id="month"></label>
          <input id="slider" type="range" min="0" max="11" step="1" value="0" />
        </div>
        <div class="map-overlay-inner">
          <div id="legend" class="legend">
            <div class="bar"></div>
            <div>Magnitude (m)</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};