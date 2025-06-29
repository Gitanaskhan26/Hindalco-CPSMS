'use client';

import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Permit, RiskLevel } from '@/lib/types';
import { renderToStaticMarkup } from 'react-dom/server';
import { Badge } from './ui/badge';
import { CardHeader, CardContent, CardTitle } from './ui/card';

// --- Helper Functions and Constants ---

const riskColorMap: Record<RiskLevel, string> = {
  high: '#EF4444',
  medium: '#F97316',
  low: '#22C55E',
};

const createCustomIcon = (riskLevel: RiskLevel) => {
  return L.divIcon({
    html: `<span style="background-color: ${riskColorMap[riskLevel]}; width: 1.5rem; height: 1.5rem; display: block; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></span>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const createPopupContent = (permit: Permit) => {
  // We use renderToStaticMarkup to convert React components to an HTML string
  return renderToStaticMarkup(
    <div className="w-64 p-0 m-0 font-sans">
      <CardHeader className="p-2">
        <Badge
          variant="outline"
          className={`w-fit capitalize border-2 ${
            permit.riskLevel === 'high'
              ? 'border-red-500 text-red-500'
              : permit.riskLevel === 'medium'
              ? 'border-orange-500 text-orange-500'
              : 'border-green-500 text-green-500'
          }`}
        >
          {permit.riskLevel} Risk
        </Badge>
        <CardTitle className="text-base pt-1">
          Permit #{permit.id.slice(0, 4)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {permit.description}
        </p>
      </CardContent>
    </div>
  );
};


// --- Map Controller Component ---
// This component handles all the dynamic logic: markers, popups, and view changes.

interface MapControllerProps {
  permits: Permit[];
  selectedPermit: Permit | null;
  onMarkerClick: (permit: Permit | null) => void;
}

function MapController({ permits, selectedPermit, onMarkerClick }: MapControllerProps) {
  const map = useMap();
  const markersRef = React.useRef<Record<string, L.Marker>>({});

  // Effect to add/update/remove markers when permits change
  React.useEffect(() => {
    const currentMarkers = markersRef.current;
    const newMarkers: Record<string, L.Marker> = {};

    // Add or update markers
    permits.forEach(permit => {
      let marker;
      if (currentMarkers[permit.id]) {
        // Marker exists, just move it to the new marker list
        marker = currentMarkers[permit.id];
        delete currentMarkers[permit.id];
      } else {
        // Marker is new, create it
        const icon = createCustomIcon(permit.riskLevel);
        marker = L.marker([permit.lat, permit.lng], { icon })
          .addTo(map)
          .on('click', () => onMarkerClick(permit));
      }
      marker.bindPopup(createPopupContent(permit));
      newMarkers[permit.id] = marker;
    });

    // Remove old markers that are no longer in the permits list
    Object.values(currentMarkers).forEach(marker => marker.removeFrom(map));
    
    // Update the ref
    markersRef.current = newMarkers;

  }, [permits, map, onMarkerClick]);


  // Effect to fly to and open popup for the selected permit
  React.useEffect(() => {
    if (selectedPermit && markersRef.current[selectedPermit.id]) {
        const marker = markersRef.current[selectedPermit.id];
        map.flyTo(marker.getLatLng(), 15, {
            animate: true,
            duration: 0.5
        });
        // A small delay helps ensure the flyTo is complete before opening popup
        setTimeout(() => {
            if (map.hasLayer(marker)) {
              marker.openPopup();
            }
        }, 500)
    }
  }, [selectedPermit, map]);

  return null; // This component does not render anything itself
}


// --- Map View Component (The Main, Stable Container) ---

interface MapViewProps {
  permits: Permit[];
  selectedPermit: Permit | null;
  onMarkerClick: (permit: Permit | null) => void;
}

export default function MapView({ permits, selectedPermit, onMarkerClick }: MapViewProps) {
  const defaultPosition: L.LatLngExpression = [22.5726, 88.3639];

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController
        permits={permits}
        selectedPermit={selectedPermit}
        onMarkerClick={onMarkerClick}
      />
    </MapContainer>
  );
}
