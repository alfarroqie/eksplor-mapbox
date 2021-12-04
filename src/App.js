import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvY29vcmVvIiwiYSI6ImNrdDgxZG5ibzB4dGkycGxqZmU0YnNuMzEifQ.smJZQqkcsSI_Su9WCxbQvQ'

export default function MapDataDownload() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-96);
  const [lat, setLat] = useState(37.8);
  const [zoom, setZoom] = useState(2);
  //INIT MAP
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/light-v10',
    center: [lng, lat],
    zoom: zoom
    });
  });

  //
  useEffect(() => {
    if(!map.current) return;
    map.current.on('load', () => {
      // Add an image to use as a custom marker
      map.current.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
        if (error) throw error;
        map.current.addImage('custom-marker', image);
        // Add a GeoJSON source with 2 points
        map.current.addSource('points', {
          'type': 'geojson',
          'data': {
          'type': 'FeatureCollection',
          'features': [
          {
          // feature for Mapbox DC
          'type': 'Feature',
          'geometry': {
          'type': 'Point',
          'coordinates': [
          -77.03238901390978, 38.913188059745586
          ]
          },
          'properties': {
          'title': 'Mapbox DC'
          }
          },
          {
          // feature for Mapbox SF
          'type': 'Feature',
          'geometry': {
          'type': 'Point',
          'coordinates': [-122.414, 37.776]
          },
          'properties': {
          'title': 'Mapbox SF'
          }
          }
          ]
          }
        });
        
        // Add a symbol layer
        map.current.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'points',
          'layout': {
          'icon-image': 'custom-marker',
          // get the title name from the source's "title" property
          'text-field': ['get', 'title'],
          'text-font': [
          'Open Sans Semibold',
          'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 1.25],
          'text-anchor': 'top'
          }
        });
        }
      );
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