import * as ol from 'ol';
import { useEffect, useRef } from 'react';
import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import useAppStore from '../utils/store';
import Graticule from 'ol/layer/Graticule';
import { Stroke } from 'ol/style';

const Map = () => {
  const setMap = useAppStore((state) => state.setMap);
  const mapRef = useRef<React.ElementRef<'div'>>(null);

  useEffect(() => {
    if (mapRef.current === null) return;

    // Create the map with base layers
    const map = new ol.Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          className: 'osm',
          source: new OSM(),
        }),
        new TileLayer({
          className: 'carto',
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{scale}.png',
            attributions: '© <a href="https://carto.com/attributions">CARTO</a>',
          }),
        }),
      ],
      view: new ol.View({
        center: fromLonLat([78.82267823570697, 23.079463270758126]),
        zoom: 6,
      }),
    });

    // Store the map instance
    setMap(map);

    // Add grid overlay using Graticule with a more visible style
    const graticule = new Graticule({
      strokeStyle: new Stroke({
        color: 'rgba(255, 0, 0, 0.8)', // bright red
        width: 2,
        lineDash: [4, 4],
      }),
      showLabels: true,
    });
    graticule.setMap(map);
  }, [setMap]);

  return <div ref={mapRef} id="map" style={{ width: '100%', height: '100vh' }}></div>;
};

export default Map;
