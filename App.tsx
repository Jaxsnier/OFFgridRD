
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';

interface Client {
    id: string;
    name: string;
    lat: number;
    lng: number;
    phone: string;
    amount: number;
    distance?: number;
}

// Helper function to create styled InfoWindow content
const createInfoWindowContent = (client: Client): string => {
    return `
        <div style="color: #333; font-family: Arial, sans-serif; padding: 8px;">
            <h3 style="font-weight: bold; font-size: 1.1rem; margin: 0 0 8px 0;">${client.name}</h3>
            <p style="font-size: 0.9rem; margin: 4px 0;"><strong>Teléfono:</strong> ${client.phone}</p>
            <p style="font-size: 0.9rem; margin: 4px 0;"><strong>Consumo:</strong> ${client.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
        </div>
    `;
};

const NosotrosPage: React.FC = () => (
    <div className="p-8 w-full bg-white h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Sobre Nosotros</h1>
            <p className="text-slate-600">
                Aquí irá la información sobre OFFgridRD.
            </p>
        </div>
    </div>
);


const App: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [centerMarker, setCenterMarker] = useState<any>(null);

    const [radiusKm, setRadiusKm] = useState<number>(5);
    const [referencePoint, setReferencePoint] = useState<any | null>(null);
    const [isSettingCenter, setIsSettingCenter] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<'potenciales' | 'nosotros'>('potenciales');
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);


    const mapRef = useRef<HTMLDivElement>(null);
    const resultListRef = useRef<HTMLUListElement>(null);
    const infoWindowRef = useRef<any>(null);
    const radiusCircleRef = useRef<any>(null);

    const isSettingCenterRef = useRef(isSettingCenter);
    const CLIENTS_PER_PAGE = 1500;

    useEffect(() => {
        isSettingCenterRef.current = isSettingCenter;
    }, [isSettingCenter]);

    // Dynamically load Google Maps script
    useEffect(() => {
        // Vercel and other React build tools require the REACT_APP_ prefix
        // to expose environment variables to the client-side code.
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            setError("La clave de API de Google Maps no está configurada. Por favor, configúrala en los secretos del entorno con el nombre REACT_APP_GOOGLE_MAPS_API_KEY.");
            return;
        }

        if ((window as any).google && (window as any).google.maps) {
            setScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
        script.async = true;
        
        const onScriptLoad = () => setScriptLoaded(true);
        const onScriptError = () => setError("No se pudo cargar el script de Google Maps. Verifica la clave de API y la conexión a internet.");

        script.addEventListener('load', onScriptLoad);
        script.addEventListener('error', onScriptError);

        document.head.appendChild(script);

        return () => {
            script.removeEventListener('load', onScriptLoad);
            script.removeEventListener('error', onScriptError);
        };
    }, []);


    // Initialize Map & Click Listener
    useEffect(() => {
        if (scriptLoaded && mapRef.current && !map) {
            const googleMap = new (window as any).google.maps.Map(mapRef.current, {
                center: { lat: 19.4326, lng: -99.1332 }, // Mexico City
                zoom: 8,
            });
            setMap(googleMap);

            infoWindowRef.current = new (window as any).google.maps.InfoWindow();

            googleMap.addListener('click', (e: any) => {
                if (isSettingCenterRef.current) {
                    setReferencePoint(e.latLng);
                    setIsSettingCenter(false);
                }
            });
        }
    }, [map, scriptLoaded]);
    
    // Manage Reference Point Marker
    useEffect(() => {
        if (centerMarker) {
            centerMarker.setMap(null); 
        }
    
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


    // Center map on initial client load
    useEffect(() => {
        if (map && clients.length > 0) {
            const bounds = new (window as any).google.maps.LatLngBounds();
            clients.forEach(client => {
                bounds.extend({ lat: client.lat, lng: client.lng });
            });
            map.fitBounds(bounds);
        }
    }, [clients, map]);

    // Handle cursor change on map
    useEffect(() => {
        if (map) {
            if (isSettingCenter) {
                map.setOptions({ draggableCursor: 'crosshair' });
            } else {
                map.setOptions({ draggableCursor: null }); // Resets to default
            }
        }
    }, [isSettingCenter, map]);


    // Handle File Upload
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError('');
        clearMap();
        setClients([]);
        setCurrentPage(1);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const parsedClients: Client[] = json.slice(1).map((row: any) => {
                const firstName = row[8] || '';
                const lastName1 = row[9] || '';
                const lastName2 = row[10] || '';
                const fullName = `${firstName} ${lastName1} ${lastName2}`.trim().replace(/\s+/g, ' ');

                return {
                    id: row[0],
                    name: fullName,
                    lat: parseFloat(row[52]),
                    lng: parseFloat(row[53]),
                    phone: row[11] || 'N/A',
                    amount: parseFloat(row[47]) || 0
                };
            }).filter(client => client.id && client.name && !isNaN(client.lat) && !isNaN(client.lng));

            if (parsedClients.length === 0) {
                throw new Error("No se encontraron clientes con datos de latitud y longitud válidos en el archivo.");
            }

            setClients(parsedClients);
            setFilteredClients(parsedClients);
        } catch (err: any) {
            setError(`Error al procesar el archivo: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // Pagination logic
    const totalPages = Math.ceil(filteredClients.length / CLIENTS_PER_PAGE);
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * CLIENTS_PER_PAGE;
        const endIndex = startIndex + CLIENTS_PER_PAGE;
        return filteredClients.slice(startIndex, endIndex);
    }, [filteredClients, currentPage]);

    // Update markers when paginatedClients change
    useEffect(() => {
        if (!map) return;

        markers.forEach(marker => marker.setMap(null));
        const newMarkers: any[] = [];
        
        paginatedClients.forEach(client => {
            const position = { lat: client.lat, lng: client.lng };
            const marker = new (window as any).google.maps.Marker({
                position,
                map,
                title: client.name,
            });

            marker.addListener('click', () => {
                const content = createInfoWindowContent(client);
                if (infoWindowRef.current) {
                    infoWindowRef.current.setContent(content);
                    infoWindowRef.current.open(map, marker);
                }

                setSelectedClientId(client.id);
                 setTimeout(() => {
                    const element = document.getElementById(`client-${client.id}`);
                    if(element) {
                       element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            });

            newMarkers.push(marker);
        });
        
        setMarkers(newMarkers);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginatedClients, map]);


    const clearMap = () => {
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
        if (radiusCircleRef.current) radiusCircleRef.current.setMap(null);
        if (centerMarker) centerMarker.setMap(null);
        setReferencePoint(null);
        radiusCircleRef.current = null;
        setCenterMarker(null);
        setSelectedClientId(null);
    };

    const handleFilter = useCallback(() => {
        if (!referencePoint || !map) {
            return;
        }

        if (radiusCircleRef.current) {
            radiusCircleRef.current.setMap(null);
        }
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

        const clientsInRadius = clients.map(client => {
            const clientLocation = new (window as any).google.maps.LatLng(client.lat, client.lng);
            const distance = (window as any).google.maps.geometry.spherical.computeDistanceBetween(referencePoint, clientLocation);
            return { ...client, distance };
        }).filter(client => (client.distance! / 1000) <= radiusKm);

        clientsInRadius.sort((a, b) => a.distance! - b.distance!);
        setFilteredClients(clientsInRadius);
        setCurrentPage(1);
        map.fitBounds(newCircle.getBounds());
    }, [clients, map, radiusKm, referencePoint]);

    // Auto-apply filter when reference point is set
    useEffect(() => {
        if (referencePoint) {
            handleFilter();
        }
    }, [referencePoint, handleFilter]);


    const handleClientSelect = (client: Client) => {
        if (!map || !infoWindowRef.current) return;

        setSelectedClientId(client.id);

        const clientIndex = paginatedClients.findIndex(c => c.id === client.id);

        if (clientIndex !== -1 && markers[clientIndex]) {
            const marker = markers[clientIndex];

            const content = createInfoWindowContent(client);
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(map, marker);

            map.panTo(marker.getPosition());
        }
    };
    
    return (
        <div className="flex flex-col h-screen font-sans bg-slate-100">
             {/* Unified Sidebar Menu */}
            <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)}></div>
                <div className={`relative w-full max-w-sm bg-white h-full shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 flex justify-between items-center border-b">
                        <h2 className="text-xl font-bold text-slate-800">Menú</h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-slate-100" aria-label="Cerrar menú">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="overflow-y-auto h-[calc(100vh-65px)]">
                         <nav className="p-4 border-b">
                            <ul>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('potenciales'); setIsSidebarOpen(false); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'potenciales' ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                                        Base De Datos
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('nosotros'); setIsSidebarOpen(false); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'nosotros' ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                                        Nosotros
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        
                        {activeView === 'potenciales' && (
                           <div className="p-6 flex flex-col space-y-6">
                                <div className="border-t pt-4">
                                    <h2 className="font-semibold text-lg text-slate-700 mb-2">1. Cargar Archivo</h2>
                                    <input
                                        type="file"
                                        accept=".xlsx"
                                        onChange={handleFile}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {loading && <p className="text-blue-600 mt-2">Cargando y procesando clientes...</p>}
                                    {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
                                </div>

                                <div className="border-t pt-4">
                                    <h2 className="font-semibold text-lg text-slate-700 mb-2">2. Filtro por Proximidad</h2>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => { setIsSettingCenter(true); setIsSidebarOpen(false); }}
                                            className={`w-full px-4 py-2 rounded-md font-semibold text-white transition-colors ${isSettingCenter ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            {isSettingCenter ? 'Haz clic en el mapa...' : 'Establecer Punto de Referencia'}
                                        </button>
                                        <div>
                                            <label htmlFor="radius" className="block text-sm font-medium text-slate-600 mb-1">Radio (km)</label>
                                            <input
                                                id="radius"
                                                type="number"
                                                value={radiusKm}
                                                onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <button
                                            onClick={handleFilter}
                                            disabled={!referencePoint}
                                            className="w-full px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Aplicar Filtro
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t pt-4 flex-grow flex flex-col min-h-0">
                                    <h2 className="font-semibold text-lg text-slate-700 mb-2">3. Resultados ({filteredClients.length})</h2>
                                    <ul ref={resultListRef} className="flex-grow overflow-y-auto bg-slate-50 p-2 rounded-md space-y-2 h-64">
                                        {paginatedClients.length > 0 ? (
                                            paginatedClients.map(client => (
                                                <li
                                                    key={client.id}
                                                    id={`client-${client.id}`}
                                                    onClick={() => handleClientSelect(client)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClientSelect(client); }}
                                                    role="button"
                                                    tabIndex={0}
                                                    className={`p-3 rounded-lg shadow-sm transition-all cursor-pointer ${selectedClientId === client.id ? 'bg-blue-100 border-2 border-blue-400' : 'bg-white border hover:bg-slate-50'}`}
                                                >
                                                    <h3 className="font-semibold text-slate-800">{client.name}</h3>
                                                    <p className="text-sm text-slate-600">Tel: {client.phone}</p>
                                                    <p className="text-sm text-slate-600">Consumo: {client.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                                                    {client.distance !== undefined && (
                                                        <p className="text-sm font-medium text-blue-700 mt-1">
                                                            Distancia: {(client.distance / 1000).toFixed(2)} km
                                                        </p>
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-center text-slate-500 py-4">No se encontraron clientes.</li>
                                        )}
                                    </ul>
                                    {totalPages > 1 && (
                                        <div className="flex justify-between items-center pt-4 border-t mt-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Anterior
                                            </button>
                                            <span className="text-sm text-slate-600">
                                                Página {currentPage} de {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="flex-shrink-0 bg-white shadow z-40">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="block p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100" aria-label="Abrir menú">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-slate-800 md:ml-0 ml-3">OFFgridRD</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
             <main className="flex-grow min-h-0">
                <div className={`w-full h-full ${activeView === 'potenciales' ? '' : 'hidden'}`}>
                    <div ref={mapRef} className="w-full h-full" />
                </div>
                <div className={`w-full h-full ${activeView === 'nosotros' ? '' : 'hidden'}`}>
                   <NosotrosPage />
                </div>
            </main>
        </div>
    );
};

export default App;
