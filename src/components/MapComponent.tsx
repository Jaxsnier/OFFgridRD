import React, { useEffect, useRef, useState } from 'react';
import { Client } from '../types';

interface MapComponentProps {
    onMapLoad: (mapInstance: any) => void;
    paginatedClients: Client[];
    filteredClients: Client[];
    referencePoint: any | null;
    radiusKm: number;
    isSettingCenter: boolean;
    onSetReferencePoint: (latLng: any) => void;
    onIsSettingCenterChange: (isSetting: boolean) => void;
    onClientSelect: (client: Client) => void;
    selectedClientId: string | null;
    infoWindowRef: React.MutableRefObject<any>;
}

const createInfoWindowContent = (client: Client): string => {
    return `
        <div style="color: #333; font-family: Arial, sans-serif; padding: 8px;">
            <h3 style="font-weight: bold; font-size: 1.1rem; margin: 0 0 8px 0;">${client.name}</h3>
            <p style="font-size: 0.9rem; margin: 4px 0;"><strong>Teléfono:</strong> ${client.phone}</p>
            <p style="font-size: 0.9rem; margin: 4px 0;"><strong>Consumo:</strong> ${client.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
        </div>
    `;
};

const MapComponent: React.FC<MapComponentProps> = ({ 
    onMapLoad, 
    paginatedClients,
    filteredClients,
    referencePoint,
    radiusKm,
    isSettingCenter,
    onSetReferencePoint,
    onIsSettingCenterChange,
    onClientSelect,
    selectedClientId,
    infoWindowRef
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [centerMarker, setCenterMarker] = useState<any>(null);
    const radiusCircleRef = useRef<any>(null);
    const dataLoadedRef = useRef(false);

    // Initialize map
    useEffect(() => {
        if (mapRef.current && !map) {
            const googleMap = new (window as any).google.maps.Map(mapRef.current, {
                center: { lat: 19.4326, lng: -99.1332 }, // Mexico City
                zoom: 8,
            });
            setMap(googleMap);
            onMapLoad(googleMap);
        }
    }, [map, onMapLoad]);
    
    // Auto-zoom to fit markers when data is first loaded
    useEffect(() => {
        if (!map || filteredClients.length === 0 || dataLoadedRef.current) {
            return;
        }

        const bounds = new (window as any).google.maps.LatLngBounds();
        filteredClients.forEach(client => {
            bounds.extend({ lat: client.lat, lng: client.lng });
        });

        if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
            if (filteredClients.length === 1) {
                map.setZoom(14);
            }
            dataLoadedRef.current = true;
        }
    }, [filteredClients, map]);

    // Reset data loaded flag when file is cleared
    useEffect(() => {
        if (filteredClients.length === 0) {
            dataLoadedRef.current = false;
        }
    }, [filteredClients]);


    // Map click listener to set reference point
    useEffect(() => {
        if (!map) return;
        const clickListener = map.addListener('click', (e: any) => {
            if (isSettingCenter) {
                onSetReferencePoint(e.latLng);
                onIsSettingCenterChange(false);
            }
        });
        return () => {
            (window as any).google.maps.event.removeListener(clickListener);
        };
    }, [map, isSettingCenter, onSetReferencePoint, onIsSettingCenterChange]);

    // Update map cursor
    useEffect(() => {
        if (map) {
            map.setOptions({ draggableCursor: isSettingCenter ? 'crosshair' : null });
        }
    }, [map, isSettingCenter]);

    // Draw/update reference point marker
    useEffect(() => {
        if (centerMarker) centerMarker.setMap(null);
        if (referencePoint && map) {
            const newCenterMarker = new (window as any).google.maps.Marker({
                position: referencePoint,
                map: map,
                title: 'Punto de Referencia',
                icon: {
                    path: (window as any).google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: '#FF0000',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF'
                }
            });
            setCenterMarker(newCenterMarker);
        } else {
            setCenterMarker(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [referencePoint, map]);

    // Draw/update radius circle
    useEffect(() => {
        if (radiusCircleRef.current) radiusCircleRef.current.setMap(null);
        if (referencePoint && map) {
            const newCircle = new (window as any).google.maps.Circle({
                strokeColor: '#007bff',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#007bff',
                fillOpacity: 0.2,
                map,
                center: referencePoint,
                radius: radiusKm * 1000,
                clickable: false
            });
            radiusCircleRef.current = newCircle;
            map.fitBounds(newCircle.getBounds());
        }
    }, [referencePoint, radiusKm, map]);

    // Update client markers
    useEffect(() => {
        if (!map) return;

        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        const newMarkers: any[] = [];
        
        paginatedClients.forEach(client => {
            const marker = new (window as any).google.maps.Marker({
                position: { lat: client.lat, lng: client.lng },
                map,
                title: client.name,
            });

            marker.addListener('click', () => {
                onClientSelect(client);
            });

            newMarkers.push(marker);
        });
        
        setMarkers(newMarkers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginatedClients, map]);
    
    // Open InfoWindow for selected client
    useEffect(() => {
        if (!map || !infoWindowRef.current || !selectedClientId) return;

        const client = paginatedClients.find(c => c.id === selectedClientId);
        const marker = markers[paginatedClients.findIndex(c => c.id === selectedClientId)];

        if (client && marker) {
            const content = createInfoWindowContent(client);
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(map, marker);
            map.panTo(marker.getPosition());
        } else {
            infoWindowRef.current.close();
        }
    }, [selectedClientId, paginatedClients, markers, map, infoWindowRef]);

    return <div ref={mapRef} className="w-full h-full" />;
};

export default MapComponent;