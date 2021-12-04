import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvY29vcmVvIiwiYSI6ImNrdDgxZG5ibzB4dGkycGxqZmU0YnNuMzEifQ.smJZQqkcsSI_Su9WCxbQvQ'

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-98);
  const [lat, setLat] = useState(38.88);
  const [zoom, setZoom] = useState(4);
  const zoomThreshold = 5;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/light-v10',
    center: [lng, lat],
    zoom: zoom,
    minZoom: 4
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
    });
  });
  //polygon
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('load', () => {
      map.current.addSource('population', {
        'type': 'vector',
        'url': 'mapbox://mapbox.660ui7x6'
      });
      map.current.addLayer(
      {
        'id': 'state-population',
        'source': 'population',
        'source-layer': 'state_county_population_2014_cen',
        'maxzoom': zoomThreshold,
        'type': 'fill',
        // only include features for which the "isState"
        // property is "true"
        'filter': ['==', 'isState', true],
        'paint': {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            0,
            '#F2F12D',
            500000,
            '#EED322',
            750000,
            '#E6B71E',
            1000000,
            '#DA9C20',
            2500000,
            '#CA8323',
            5000000,
            '#B86B25',
            7500000,
            '#A25626',
            10000000,
            '#8B4225',
            25000000,
            '#723122'
          ],
          'fill-opacity': 0.75
        }
      },
      'waterway-label'
      );
    
      map.current.addLayer(
      {
        'id': 'county-population',
        'source': 'population',
        'source-layer': 'state_county_population_2014_cen',
        'minzoom': zoomThreshold,
        'type': 'fill',
        // only include features for which the "isCounty"
        // property is "true"
        'filter': ['==', 'isCounty', true],
        'paint': {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            0,
            '#F2F12D',
            100,
            '#EED322',
            1000,
            '#E6B71E',
            5000,
            '#DA9C20',
            10000,
            '#CA8323',
            50000,
            '#B86B25',
            100000,
            '#A25626',
            500000,
            '#8B4225',
            1000000,
            '#723122'
          ],
          'fill-opacity': 0.75
        }
      },
      'waterway-label'
      );

    });
  });
  return (
  <div>
    <div className="sidebar">
      Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
    <div ref={mapContainer} className="map-container" />
  </div>
  );
};