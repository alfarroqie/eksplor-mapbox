import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

import data from "./data.geojson"

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvY29vcmVvIiwiYSI6ImNrdDgxZG5ibzB4dGkycGxqZmU0YnNuMzEifQ.smJZQqkcsSI_Su9WCxbQvQ'

export default function MapDataDownload() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-121.403732);
  const [lat, setLat] = useState(40.492392);
  const [zoom, setZoom] = useState(10);
  //INIT MAP
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [lng, lat],
    zoom: zoom
    });

    map.current.addControl(new mapboxgl.NavigationControl());
  });

  //
  useEffect(() => {
    if(!map.current) return;
    map.current.on('load', () => {
      map.current.addSource('national-park', {
        'type': 'geojson',
        'data': data,
      });
      map.current.addLayer({
        'id': 'park-boundary',
        'type': 'fill',
        'source': 'national-park',
        'paint': {
        'fill-color': '#888888',
        'fill-opacity': 0.4
        },
        'filter': ['==', '$type', 'Polygon']
      });
         
      map.current.addLayer({
        'id': 'park-volcanoes',
        'type': 'circle',
        'source': 'national-park',
        'paint': {
        'circle-radius': 6,
        'circle-color': '#B42222'
        },
        'filter': ['==', '$type', 'Point']
      });
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