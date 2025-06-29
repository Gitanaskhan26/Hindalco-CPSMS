'use client';

import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Permit, RiskLevel } from '@/lib/types';
import { Badge } from './ui/badge';
import { CardHeader, CardContent, CardTitle } from './ui/card';

// --- Helper Functions and Constants ---

const riskColorMap: Record<RiskLevel, string> = {
  high: '#EF4444', // red-500
  medium: '#F97316', // orange-500
  low: '#22C55E', // green-500
};

// Use an SVG-based map pin icon.
const createCustomIcon = (riskLevel: RiskLevel, isSelected: boolean) => {
  const color = riskColorMap[riskLevel];
  const scale = isSelected ? 1.5 : 1;

  // Using an inline SVG for the marker icon
  const svgIcon = `
    <div class="transition-transform duration-100 ease-out" style="transform: scale(${scale}); transform-origin: bottom;">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="${color}" 
        stroke="white" 
        stroke-width="1.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="white"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'leaflet-custom-div-icon', // Custom class to remove default divIcon styles
    iconSize: [28, 28],
    iconAnchor: [14, 28], // Point of the pin
    popupAnchor: [0, -28],
  });
};

const createPopupContent = (permit: Permit) => {
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


// --- Map View Component ---

interface MapViewProps {
  permits: Permit[];
  selectedPermit: Permit | null;
  onMarkerClick: (permit: Permit | null) => void;
}

const defaultPosition: L.LatLngTuple = [24.2045, 83.0396];

export default function MapView({ permits, selectedPermit, onMarkerClick }: MapViewProps) {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapInstanceRef = React.useRef<L.Map | null>(null);
    const markersRef = React.useRef<Record<string, L.Marker>>({});
    const prevSelectedIdRef = React.useRef<string | null>(null);

    // Initialize map
    React.useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(defaultPosition, 14);
            L.control.zoom({ position: 'bottomright' }).addTo(map);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            mapInstanceRef.current = map;
        }
        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Sync markers with permits and selection
    React.useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const displayedMarkerIds = new Set(Object.keys(markersRef.current));
        
        permits.forEach(permit => {
            const isSelected = selectedPermit?.id === permit.id;
            const icon = createCustomIcon(permit.riskLevel, isSelected);
            const position: L.LatLngTuple = [permit.lat, permit.lng];

            if (markersRef.current[permit.id]) {
                const marker = markersRef.current[permit.id];
                marker.setLatLng(position);
                marker.setIcon(icon);
                if (isSelected) {
                    marker.setZIndexOffset(1000);
                } else {
                    marker.setZIndexOffset(0);
                }
                displayedMarkerIds.delete(permit.id);
            } else {
                const marker = L.marker(position, { icon })
                    .addTo(map)
                    .on('click', () => onMarkerClick(permit));
                marker.bindPopup(createPopupContent(permit));
                markersRef.current[permit.id] = marker;
            }
        });

        displayedMarkerIds.forEach(id => {
            markersRef.current[id].removeFrom(map);
            delete markersRef.current[id];
        });

        // Handle map centering and popup opening
        const newSelectedId = selectedPermit?.id;
        if (newSelectedId && newSelectedId !== prevSelectedIdRef.current) {
            const marker = markersRef.current[newSelectedId];
            if (marker) {
                map.flyTo(marker.getLatLng(), 16, { animate: true, duration: 0.5 });
                const timer = setTimeout(() => marker.openPopup(), 500);
                // No cleanup function here as it could clear timers for rapid selections.
            }
        }
        prevSelectedIdRef.current = newSelectedId ?? null;

    }, [permits, selectedPermit, onMarkerClick]);


    return (
        <div 
            ref={mapContainerRef} 
            style={{ height: '100%', width: '100%' }} 
            className="z-0"
        />
    );
}
