'use client';

import * as React from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import type { Permit, RiskLevel } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const riskColorMap: Record<RiskLevel, string> = {
  high: '#EF4444', // red-500
  medium: '#F97316', // orange-500
  low: '#22C55E', // green-500
};

interface MapViewProps {
  permits: Permit[];
  selectedPermit: Permit | null;
  onMarkerClick: (permit: Permit) => void;
}

export function MapView({ permits, selectedPermit, onMarkerClick }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-lg font-semibold">Map Unavailable</p>
          <p className="text-sm text-muted-foreground">
            Google Maps API key is not configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId="hindalco-map"
        style={{ width: '100%', height: '100%' }}
        center={selectedPermit ? { lat: selectedPermit.lat, lng: selectedPermit.lng } : { lat: 22.5726, lng: 88.3639 }}
        zoom={14}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {permits.map(permit => (
          <AdvancedMarker
            key={permit.id}
            position={{ lat: permit.lat, lng: permit.lng }}
            onClick={() => onMarkerClick(permit)}
          >
             <Pin
                background={riskColorMap[permit.riskLevel]}
                borderColor={'#fff'}
                glyphColor={'#fff'}
              />
          </AdvancedMarker>
        ))}
         {selectedPermit && (
          <InfoWindow
            position={{ lat: selectedPermit.lat + 0.005, lng: selectedPermit.lng }}
            onCloseClick={() => onMarkerClick(null as any)}
          >
            <div className="w-64">
              <CardHeader className="p-2">
                <Badge 
                  variant="outline" 
                  className={`w-fit capitalize border-2 ${
                  selectedPermit.riskLevel === 'high' ? 'border-red-500 text-red-500' :
                  selectedPermit.riskLevel === 'medium' ? 'border-orange-500 text-orange-500' :
                  'border-green-500 text-green-500'
                }`}
                >
                  {selectedPermit.riskLevel} Risk
                </Badge>
                <CardTitle className="text-base pt-1">Permit #{selectedPermit.id.slice(0, 4)}</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">{selectedPermit.description}</p>
              </CardContent>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
