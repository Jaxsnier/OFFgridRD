import React, { useEffect, useRef, useState } from 'react';
import { Client } from '../types';

interface MapComponentProps {
    onMapLoad: (mapInstance: any) => void;
    paginatedClients: Client[];
    filteredClients: Client[];
    referencePoint: any | null;
    radiusMeters: number;
    isSettingCenter: boolean;
    onSetReferencePoint: (latLng: any) => void;
    onIsSettingCenterChange: (isSetting: boolean) => void;
    onClientSelect: (client: Client | null) => void;
    onUpdateClient: (clientId: string, comment: string) => void;
    selectedClientId: string | null;
    infoWindowRef: React.MutableRefObject<any>;
}


const MapComponent: React.FC<MapComponentProps> = ({ 
    onMapLoad, 
    paginatedClients,
    filteredClients,
    referencePoint,
    radiusMeters,
    isSettingCenter,
    onSetReferencePoint,
    onIsSettingCenterChange,
    onClientSelect,
    onUpdateClient,
    selectedClientId,
    infoWindowRef
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [centerMarker, setCenterMarker] = useState<any>(null);
    const radiusCircleRef = useRef<any>(null);
    const dataLoadedRef = useRef(false);

    const getMarkerScale = (zoom: number): number => {
        if (!zoom) return 4; // Default scale
        // Adjust formula for a more noticeable scaling effect on zoom out
        return Math.max(2.5, Math.min(10, zoom / 1.7));
    };

    // Initialize map
    useEffect(() => {
        if (mapRef.current && !map) {
            const googleMap = new (window as any).google.maps.Map(mapRef.current, {
                center: { lat: 19.4326, lng: -99.1332 }, // Mexico City
                zoom: 8,
                clickableIcons: false, // Disables popups for Google's points of interest
                gestureHandling: 'greedy' // Allows zooming without holding Ctrl
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


    // Map click listener to set reference point or close InfoWindow
    useEffect(() => {
        if (!map) return;
        const clickListener = map.addListener('click', (e: any) => {
            if (isSettingCenter) {
                onSetReferencePoint(e.latLng);
                onIsSettingCenterChange(false);
            } else {
                onClientSelect(null);
            }
        });
        return () => {
            (window as any).google.maps.event.removeListener(clickListener);
        };
    }, [map, isSettingCenter, onSetReferencePoint, onIsSettingCenterChange, onClientSelect]);

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
                radius: radiusMeters,
                clickable: false
            });
            radiusCircleRef.current = newCircle;
            map.fitBounds(newCircle.getBounds());
        }
    }, [referencePoint, radiusMeters, map]);

    // Update client markers
    useEffect(() => {
        if (!map) return;

        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        const newMarkers: any[] = [];
        
        const currentZoom = map.getZoom();
        const scale = getMarkerScale(currentZoom);

        paginatedClients.forEach(client => {
            const marker = new (window as any).google.maps.Marker({
                position: { lat: client.lat, lng: client.lng },
                map,
                title: client.name,
                icon: {
                    path: (window as any).google.maps.SymbolPath.CIRCLE,
                    scale: scale,
                    fillColor: client.visto === 1 ? '#28a745' : '#007bff', // Green if seen, blue otherwise
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: '#FFFFFF'
                }
            });

            marker.addListener('click', () => {
                onClientSelect(client);
            });

            newMarkers.push(marker);
        });
        
        setMarkers(newMarkers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginatedClients, map]);
    
    // Add zoom listener to scale markers
    useEffect(() => {
        if (!map) return;

        const zoomListener = map.addListener('zoom_changed', () => {
            const newZoom = map.getZoom();
            if (!newZoom) return;
            const newScale = getMarkerScale(newZoom);

            markers.forEach(marker => {
                const currentIcon = marker.getIcon();
                marker.setIcon({
                    ...currentIcon,
                    scale: newScale
                });
            });
        });

        return () => {
            (window as any).google.maps.event.removeListener(zoomListener);
        };
    }, [map, markers]);


    // Open InfoWindow for selected client
    useEffect(() => {
        if (!map || !infoWindowRef.current) {
            return;
        }

        if (!selectedClientId) {
            infoWindowRef.current.close();
            return;
        }

        const client = filteredClients.find(c => c.id === selectedClientId);
        const markerIndex = paginatedClients.findIndex(c => c.id === selectedClientId);
        const marker = markerIndex !== -1 ? markers[markerIndex] : null;

        if (client && marker) {
            const container = document.createElement('div');
            container.style.color = '#333';
            container.style.fontFamily = 'Arial, sans-serif';
            container.style.padding = '8px';
            container.style.width = '280px';
            container.style.fontSize = '0.9rem';

            // Client Info con Dirección
            container.innerHTML = `
                <h3 style="font-weight: bold; font-size: 1.1rem; margin: 0 0 4px 0;">${client.name}</h3>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 0.8rem; line-height: 1.2;">${client.address}</p>
                <div style="margin: 8px 0; border-top: 1px solid #e2e8f0; padding-top: 8px;">
                    <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${client.phone}</p>
                    <p style="margin: 4px 0 12px 0;"><strong>Consumo:</strong> ${client.amount.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</p>
                </div>
            `;

            // Comment Form
            const form = document.createElement('form');
            form.style.marginTop = '8px';
            form.innerHTML = `
                <label for="comment-textarea" style="display: block; font-size: 0.9rem; font-weight: 500; margin-bottom: 4px;">Comentario:</label>
                <textarea id="comment-textarea" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.9rem; min-height: 60px; color: #334155; background-color: #fff;" rows="3"></textarea>
                <button type="submit" style="width: 100%; margin-top: 8px; padding: 8px 12px; background-color: #007bff; color: white; font-weight: 600; border-radius: 4px; border: none; cursor: pointer;">
                    Guardar Comentario
                </button>
            `;
            const textarea = form.querySelector('#comment-textarea') as HTMLTextAreaElement;
            textarea.value = client.comentario || '';

            const button = form.querySelector('button') as HTMLButtonElement;
            button.onmouseover = () => button.style.backgroundColor = '#0056b3';
            button.onmouseout = () => button.style.backgroundColor = '#007bff';


            form.addEventListener('submit', (e) => {
                e.preventDefault();
                onUpdateClient(client.id, textarea.value);
                infoWindowRef.current.close();
            });

            container.appendChild(form);

            infoWindowRef.current.setContent(container);
            infoWindowRef.current.open(map, marker);
            map.panTo(marker.getPosition());
        } else {
            infoWindowRef.current.close();
        }
    }, [selectedClientId, filteredClients, paginatedClients, markers, map, infoWindowRef, onUpdateClient, onClientSelect]);


    return <div ref={mapRef} className="w-full h-full" />;
};

export default MapComponent;