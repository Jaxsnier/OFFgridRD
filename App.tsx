import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Client } from './src/types';
import ApiKeyGate from './src/components/ApiKeyGate';
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar';
import MapComponent from './src/components/MapComponent';
import NosotrosPage from './src/components/NosotrosPage';

const App: React.FC = () => {
    // State Management
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [map, setMap] = useState<any>(null);
    
    const [radiusKm, setRadiusKm] = useState<number>(5);
    const [referencePoint, setReferencePoint] = useState<any | null>(null);
    const [isSettingCenter, setIsSettingCenter] = useState<boolean>(false);
    
    const [loading, setLoading] = useState<boolean>(false);
    const [fileError, setFileError] = useState<string>('');
    
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<'potenciales' | 'nosotros'>('potenciales');
    
    // API Key and Script Loading State
    const [apiKey, setApiKey] = useState<string>('');
    const [apiKeyError, setApiKeyError] = useState<string>('');
    const [isKeySubmitted, setIsKeySubmitted] = useState<boolean>(false);
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [isLoadingScript, setIsLoadingScript] = useState<boolean>(false);
    
    const authFailedRef = useRef(false);
    const infoWindowRef = useRef<any>(null);
    const CLIENTS_PER_PAGE = 1500;

    // --- API Key & Script Loading Logic ---

    // On initial mount, check for a saved API key in localStorage
    useEffect(() => {
        const savedApiKey = localStorage.getItem('googleMapsApiKey');
        if (savedApiKey) {
            console.log("Found saved API key. Attempting to validate...");
            handleKeySubmit(savedApiKey);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (!isKeySubmitted || !apiKey) return;

        setIsLoadingScript(true);
        setApiKeyError('');
        authFailedRef.current = false;

        const cleanupGoogleAPI = () => {
            const script = document.getElementById('google-maps-script');
            if (script) script.remove();
            delete (window as any).initMapSuccess;
            delete (window as any).gm_authFailure;
        };

        const handleAuthError = (errorMessage = "La clave de API es incorrecta o no está autorizada.") => {
            if (authFailedRef.current) return;
            authFailedRef.current = true;
            
            localStorage.removeItem('googleMapsApiKey'); // Crucial: Remove bad key
            console.error("Google Maps API Key Authentication Failed.");
            setApiKeyError(errorMessage);
            setIsKeySubmitted(false);
            setApiKey('');
            setIsLoadingScript(false);
            setScriptLoaded(false);
            cleanupGoogleAPI();
        };

        const handleSuccess = () => {
            if (authFailedRef.current) {
                console.warn("Success callback ignored because authentication already failed.");
                return;
            }
            
            try {
                // Active validation: The most reliable way to check a key is to use a core API service.
                new (window as any).google.maps.Geocoder();

                console.log("API key validated successfully.");
                localStorage.setItem('googleMapsApiKey', apiKey); // Crucial: Save good key
                setScriptLoaded(true);
                setIsLoadingScript(false);
                setApiKeyError('');

            } catch (error) {
                console.error("Caught error during active API validation:", error);
                handleAuthError("La clave de API es inválida o la API no pudo inicializarse.");
            }
        };
        
        cleanupGoogleAPI();

        (window as any).initMapSuccess = handleSuccess;
        (window as any).gm_authFailure = () => handleAuthError();

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initMapSuccess`;
        script.async = true;
        script.defer = true;
        script.onerror = () => handleAuthError("No se pudo cargar el script. Verifica tu conexión o la clave de API.");

        document.head.appendChild(script);

        return () => {
            cleanupGoogleAPI();
        };
    }, [apiKey, isKeySubmitted]);

    const handleKeySubmit = (submittedKey: string) => {
        setScriptLoaded(false);
        setApiKey(submittedKey);
        setIsKeySubmitted(true);
    };

    // --- Map and Data Logic ---
    const handleMapLoad = useCallback((mapInstance: any) => {
        setMap(mapInstance);
        infoWindowRef.current = new (window as any).google.maps.InfoWindow();
    }, []);
    
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setFileError('');
        setClients([]);
        setFilteredClients([]);
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
                throw new Error("No se encontraron clientes con datos de latitud y longitud válidos.");
            }

            setClients(parsedClients);
            setFilteredClients(parsedClients);
        } catch (err: any) {
            setFileError(`Error al procesar el archivo: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleFilter = useCallback(() => {
        if (!referencePoint || !map) return;

        const clientsInRadius = clients.map(client => {
            const clientLocation = new (window as any).google.maps.LatLng(client.lat, client.lng);
            const distance = (window as any).google.maps.geometry.spherical.computeDistanceBetween(referencePoint, clientLocation);
            return { ...client, distance };
        }).filter(client => (client.distance! / 1000) <= radiusKm);

        clientsInRadius.sort((a, b) => a.distance! - b.distance!);
        setFilteredClients(clientsInRadius);
        setCurrentPage(1);
    }, [clients, map, radiusKm, referencePoint]);
    
    useEffect(() => {
        if (referencePoint) {
            handleFilter();
        }
    }, [referencePoint, handleFilter]);
    
    const totalPages = Math.ceil(filteredClients.length / CLIENTS_PER_PAGE);
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * CLIENTS_PER_PAGE;
        const endIndex = startIndex + CLIENTS_PER_PAGE;
        return filteredClients.slice(startIndex, endIndex);
    }, [filteredClients, currentPage]);

    const handleClientSelect = (client: Client) => {
        setSelectedClientId(client.id);
    };

    if (!scriptLoaded) {
        return <ApiKeyGate onSubmit={handleKeySubmit} error={apiKeyError} isLoading={isLoadingScript} />;
    }

    return (
        <div className="flex flex-col h-screen font-sans bg-slate-100">
            <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeView={activeView}
                onNavClick={setActiveView}
                onFileChange={handleFile}
                loading={loading}
                fileError={fileError}
                isSettingCenter={isSettingCenter}
                onSetCenterClick={() => { setIsSettingCenter(true); setIsSidebarOpen(false); }}
                radiusKm={radiusKm}
                onRadiusChange={setRadiusKm}
                onFilterClick={handleFilter}
                referencePoint={referencePoint}
                filteredClients={filteredClients}
                paginatedClients={paginatedClients}
                selectedClientId={selectedClientId}
                onClientSelect={handleClientSelect}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <main className="flex-grow min-h-0">
                <div className={`w-full h-full ${activeView === 'potenciales' ? '' : 'hidden'}`}>
                    <MapComponent 
                        onMapLoad={handleMapLoad}
                        paginatedClients={paginatedClients}
                        filteredClients={filteredClients}
                        referencePoint={referencePoint}
                        radiusKm={radiusKm}
                        isSettingCenter={isSettingCenter}
                        onSetReferencePoint={setReferencePoint}
                        onIsSettingCenterChange={setIsSettingCenter}
                        onClientSelect={handleClientSelect}
                        selectedClientId={selectedClientId}
                        infoWindowRef={infoWindowRef}
                    />
                </div>
                <div className={`w-full h-full ${activeView === 'nosotros' ? '' : 'hidden'}`}>
                   <NosotrosPage />
                </div>
            </main>
        </div>
    );
};

export default App;