'use client';

import 'leaflet/dist/leaflet.css';
import * as React from 'react';
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


// --- Map View Component (Imperative Approach) ---

interface MapViewProps {
  permits: Permit[];
  selectedPermit: Permit | null;
  onMarkerClick: (permit: Permit | null) => void;
}

export default function MapView({ permits, selectedPermit, onMarkerClick }: MapViewProps) {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapInstanceRef = React.useRef<L.Map | null>(null);
    const markersRef = React.useRef<Record<string, L.Marker>>({});

    // Effect to initialize the map
    React.useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [22.5726, 88.3639],
                zoom: 13,
                scrollWheelZoom: true,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            mapInstanceRef.current = map;
        }
        
        // Cleanup function to destroy the map instance on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Effect to manage markers based on permit data
    React.useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const currentMarkers = markersRef.current;
        const newMarkers: Record<string, L.Marker> = {};

        permits.forEach(permit => {
            let marker;
            if (currentMarkers[permit.id]) {
                marker = currentMarkers[permit.id];
                delete currentMarkers[permit.id];
            } else {
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
        markersRef.current = newMarkers;

    }, [permits, onMarkerClick]);

    // Effect to handle selecting a permit
    React.useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

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
            }, 500);
        }
    }, [selectedPermit]);


    return (
        <div 
            ref={mapContainerRef} 
            style={{ height: '100%', width: '100%' }} 
            className="z-0"
        />
    );
}
