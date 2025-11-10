import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapDisplay = ({ pickupCoords, dropoffCoords, errandCoords, signCurrentCoords, signDestinationCoords, serviceType }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstance.current) {
      try {
        mapInstance.current = L.map(mapRef.current).setView([34.0489, -84.2938], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstance.current);
      } catch (error) {
        console.error('Error initializing map:', error);
        return;
      }
    }

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    const markers = [];

    // Create custom icon with text label
    const createCustomIcon = (color, label) => {
      return L.divIcon({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="
              width: 32px;
              height: 40px;
              background-color: ${color};
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
            <div style="
              background-color: ${color};
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: 600;
              font-size: 12px;
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">${label}</div>
          </div>
        `,
        iconSize: [40, 60],
        iconAnchor: [20, 50],
        popupAnchor: [0, -40],
        className: 'custom-marker'
      });
    };

    // Add markers based on service type
    if (serviceType === 'delivery') {
      if (pickupCoords) {
        L.marker([pickupCoords.lat, pickupCoords.lon], {
          icon: createCustomIcon('#3b82f6', 'Pick up')
        }).bindPopup('Pickup Location').addTo(mapInstance.current);
        markers.push([pickupCoords.lat, pickupCoords.lon]);
      }

      if (dropoffCoords) {
        L.marker([dropoffCoords.lat, dropoffCoords.lon], {
          icon: createCustomIcon('#22c55e', 'Drop off')
        }).bindPopup('Dropoff Location').addTo(mapInstance.current);
        markers.push([dropoffCoords.lat, dropoffCoords.lon]);
      }
    } else if (serviceType === 'errand') {
      if (errandCoords) {
        L.marker([errandCoords.lat, errandCoords.lon], {
          icon: createCustomIcon('#22c55e', 'Errand Location')
        }).bindPopup('Errand Location').addTo(mapInstance.current);
        markers.push([errandCoords.lat, errandCoords.lon]);
      }
    } else if (serviceType === 'single-sign' || serviceType === 'multiple-signs') {
      if (signCurrentCoords) {
        L.marker([signCurrentCoords.lat, signCurrentCoords.lon], {
          icon: createCustomIcon('#f97316', 'Current Location')
        }).bindPopup('Current Sign Location').addTo(mapInstance.current);
        markers.push([signCurrentCoords.lat, signCurrentCoords.lon]);
      }

      if (signDestinationCoords) {
        L.marker([signDestinationCoords.lat, signDestinationCoords.lon], {
          icon: createCustomIcon('#ef4444', 'Destination')
        }).bindPopup('Destination Location').addTo(mapInstance.current);
        markers.push([signDestinationCoords.lat, signDestinationCoords.lon]);
      }
    }

    // Fit map to show all markers
    if (markers.length > 0) {
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
