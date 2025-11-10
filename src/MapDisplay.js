import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const MapDisplay = ({ pickupCoords, dropoffCoords, errandCoords, signCurrentCoords, signDestinationCoords, serviceType }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([34.0489, -84.2938], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    const markers = [];

    // Add markers based on service type
    if (serviceType === 'delivery') {
      if (pickupCoords) {
        const pickupMarker = L.marker([pickupCoords.lat, pickupCoords.lon], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).bindPopup('Pickup Location').addTo(mapInstance.current);
        markers.push([pickupCoords.lat, pickupCoords.lon]);
      }

      if (dropoffCoords) {
        const dropoffMarker = L.marker([dropoffCoords.lat, dropoffCoords.lon], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).bindPopup('Dropoff Location').addTo(mapInstance.current);
        markers.push([dropoffCoords.lat, dropoffCoords.lon]);
      }
    } else if (serviceType === 'errand') {
      if (errandCoords) {
        const errandMarker = L.marker([errandCoords.lat, errandCoords.lon], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).bindPopup('Errand Location').addTo(mapInstance.current);
        markers.push([errandCoords.lat, errandCoords.lon]);
      }
    } else if (serviceType === 'single-sign' || serviceType === 'multiple-signs') {
      if (signCurrentCoords) {
        const currentMarker = L.marker([signCurrentCoords.lat, signCurrentCoords.lon], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).bindPopup('Current Sign Location').addTo(mapInstance.current);
        markers.push([signCurrentCoords.lat, signCurrentCoords.lon]);
      }

      if (signDestinationCoords) {
        const destMarker = L.marker([signDestinationCoords.lat, signDestinationCoords.lon], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).bindPopup('Destination Location').addTo(mapInstance.current);
        markers.push([signDestinationCoords.lat, signDestinationCoords.lon]);
      }
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.featureGroup(mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) return layer;
      }));
      try {
        mapInstance.current.fitBounds(L.latLngBounds(markers), { padding: [50, 50] });
      } catch (e) {
        // Fallback if bounds calculation fails
        mapInstance.current.setView([34.0489, -84.2938], 11);
      }
    }
  }, [pickupCoords, dropoffCoords, errandCoords, signCurrentCoords, signDestinationCoords, serviceType]);

  return <div ref={mapRef} className="map-container w-full h-full rounded-xl" style={{ minHeight: '400px' }} />;
};

export default MapDisplay;
