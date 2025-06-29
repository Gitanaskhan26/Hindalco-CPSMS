'use client';

import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Permit, RiskLevel } from '@/lib/types';
import { Badge } from './ui/badge';
import { CardHeader, CardContent, CardTitle } from './ui/card';

// --- Helper Functions and Constants ---

const riskColorMap: Record<RiskLevel, string> = {
  high: '#EF4444', // red-500
  medium: '#F97316', // orange-500
  low: '#22C55E', // green-500
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

// --- Map Layers Component ---
// This component contains all the dynamic parts of the map (markers, popups, effects)
// It assumes it will be rendered inside a MapContainer.

interface MapLayersProps {
  permits: Permit[];
  selectedPermit: Permit | null;
  onMarkerClick: (permit: Permit | null) => void;
}

export function MapLayers({
  permits,
  selectedPermit,
  onMarkerClick,
}: MapLayersProps) {
  const map = useMap();
  const markerRefs = React.useRef<Record<string, L.Marker>>({});

  // Effect to fly to selected permit
  React.useEffect(() => {
    if (selectedPermit) {
      map.flyTo([selectedPermit.lat, selectedPermit.lng], 15);
    }
  }, [selectedPermit, map]);

  // Effect to open popup for selected permit
  React.useEffect(() => {
    if (selectedPermit && markerRefs.current[selectedPermit.id]) {
      markerRefs.current[selectedPermit.id].openPopup();
    }
  }, [selectedPermit]);

  return (
    <>
      {permits.map(permit => {
        const markerIcon = createCustomIcon(permit.riskLevel);
        return (
          <Marker
            key={permit.id}
            ref={ref => {
              if (ref) markerRefs.current[permit.id] = ref;
            }}
            position={[permit.lat, permit.lng]}
            icon={markerIcon}
            eventHandlers={{
              click: () => onMarkerClick(permit),
            }}
          >
            <Popup onClose={() => onMarkerClick(null)}>
              <div className="w-64 p-0 m-0">
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
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

// --- Map View Component (The Stable Container) ---
// This component only sets up the map and renders children. It takes no changing props.
// It will be dynamically imported on the page.

interface MapViewProps {
  children: React.ReactNode;
}

export function MapView({ children }: MapViewProps) {
  const defaultPosition: L.LatLngExpression = [22.5726, 88.3639];

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
