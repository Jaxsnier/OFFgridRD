import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Client } from './src/types';
import ApiKeyGate from './src/components/ApiKeyGate';
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar';
import MapComponent from './src/components/MapComponent';
import NosotrosPage from './src/components/NosotrosPage';
import LoadingOverlay from './src/components/LoadingOverlay';
import InicioPage from './src/components/InicioPage';
import CalculadoraSolarPage from './src/components/CalculadoraSolarPage';

type View = 'inicio' | 'calculadora' | 'potenciales' | 'nosotros';

// Fix: Declare XLSX to inform TypeScript that it's a global variable.
declare var XLSX: any;

const App: React.FC = () => {
    // State Management
    const [clients, setClients] = useState<Client[]>([]);
    const [originalData, setOriginalData] = useState<any[][]>([]);
    const [map, setMap] = useState<any>(null);
    
    const [radiusMeters, setRadiusMeters] = useState<number>(300);
    const [referencePoint, setReferencePoint] = useState<any | null>(null);
    const [isSettingCenter, setIsSettingCenter] = useState<boolean>(false);
    const [showOnlyNewClients, setShowOnlyNewClients] = useState<boolean>(false);
    
    const [loading, setLoading] = useState<boolean>(false);
    const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
    const [fileError, setFileError] = useState<string>('');
    
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<View>('inicio');
    
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
            
            localStorage.removeItem('googleMapsApiKey');
            setApiKeyError(errorMessage);
            setIsKeySubmitted(false);
            setApiKey('');
            setIsLoadingScript(false);
            setScriptLoaded(false);
            cleanupGoogleAPI();
        };

        const handleSuccess = () => {
            if (authFailedRef.current) return;
            
            try {
                new (window as any).google.maps.Geocoder();
                localStorage.setItem('googleMapsApiKey', apiKey);
                setScriptLoaded(true);
                setIsLoadingScript(false);
                setApiKeyError('');
            } catch (error) {
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
        script.onerror = () => handleAuthError("No se pudo cargar el script.");
        document.head.appendChild(script);

        return () => cleanupGoogleAPI();
    }, [apiKey, isKeySubmitted]);

    const handleKeySubmit = (submittedKey: string) => {
        setScriptLoaded(false);
        setApiKey(submittedKey);
        setIsKeySubmitted(true);
    };

    const handleNavClick = (view: View) => {
        setActiveView(view);
        if (view === 'potenciales' && !scriptLoaded) {
            const savedApiKey = localStorage.getItem('googleMapsApiKey');
            if (savedApiKey) {
                handleKeySubmit(savedApiKey);
            }
        }
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
        setIsProcessingFile(true);
        setFileError('');
        setClients([]);
        setOriginalData([]);
        setCurrentPage(1);
        setReferencePoint(null);

        try {
            const data = await file.arrayBuffer();
            
            // Use a Web Worker to process the file off the main thread
            const worker = new Worker(new URL('./src/excel.worker.ts', import.meta.url));

            worker.onmessage = (event) => {
                const { clients: parsedClients, originalData: json, error } = event.data;

                if (error) {
                    setFileError(`Error al procesar el archivo: ${error}`);
                } else {
                    if (parsedClients.length === 0) {
                        setFileError("No se encontraron clientes con datos de latitud y longitud válidos.");
                    } else {
                        setClients(parsedClients);
                        setOriginalData(json);
                        
                        // Set default reference point after data is loaded
                        const defaultLatLng = new (window as any).google.maps.LatLng(19.461620, -70.662102);
                        setReferencePoint(defaultLatLng);
                    }
                }
                
                setLoading(false);
                setIsProcessingFile(false);
                worker.terminate();
            };

            worker.onerror = (err) => {
                setFileError(`Error en el worker: ${err.message}`);
                setLoading(false);
                setIsProcessingFile(false);
                worker.terminate();
            };

            worker.postMessage(data);

        } catch (err: any) {
            setFileError(`Error al leer el archivo: ${err.message}`);
            setLoading(false);
            setIsProcessingFile(false);
        }
    };
    
    const finalFilteredClients = useMemo(() => {
        if (!scriptLoaded) return clients.filter(c => showOnlyNewClients ? c.visto === 0 : true);

        let filtered = clients;

        if (referencePoint) {
            const clientsInRadius = filtered.map(client => {
                const clientLocation = new (window as any).google.maps.LatLng(client.lat, client.lng);
                const distance = (window as any).google.maps.geometry.spherical.computeDistanceBetween(referencePoint, clientLocation);
                return { ...client, distance };
            }).filter(client => client.distance! <= radiusMeters);
    
            clientsInRadius.sort((a, b) => a.distance! - b.distance!);
            filtered = clientsInRadius;
        }

        if (showOnlyNewClients) {
            filtered = filtered.filter(client => client.visto === 0);
        }
        
        return filtered;
    }, [clients, referencePoint, radiusMeters, showOnlyNewClients, scriptLoaded]);

    useEffect(() => {
        // Reset page to 1 whenever filters change
        setCurrentPage(1);
    }, [finalFilteredClients]);

    const handleUpdateClient = (clientId: string, comment: string) => {
        const trimmedComment = comment.trim();
        const newVistoValue = trimmedComment === '' ? (0 as const) : (1 as const);

        const updateClient = (c: Client) => 
            c.id === clientId ? { ...c, comentario: trimmedComment, visto: newVistoValue } : c;
        
        setClients(prevClients => prevClients.map(updateClient));
    };

    const handleExport = (exportType: 'all' | 'filtered') => {
        if (originalData.length === 0) {
            alert("No hay datos cargados para exportar.");
            return;
        }
    
        const clientUpdates = new Map<string, { visto: 0 | 1; comentario: string }>();
        clients.forEach(c => {
            clientUpdates.set(c.id, { visto: c.visto, comentario: c.comentario });
        });
    
        const dataToExport = JSON.parse(JSON.stringify(originalData));
        
        const headers = dataToExport[0];
        let vistoIndex = headers.findIndex((h:string) => h?.toString().toLowerCase().trim() === 'visto');
        if (vistoIndex === -1) {
            vistoIndex = headers.length;
            headers.push('Visto');
        }
        
        let comentarioIndex = headers.findIndex((h:string) => h?.toString().toLowerCase().trim() === 'comentario');
        if (comentarioIndex === -1) {
            comentarioIndex = headers.length;
            headers.push('Comentario');
        }
    
        let finalData;
    
        if (exportType === 'all') {
            for (let i = 1; i < dataToExport.length; i++) {
                const row = dataToExport[i];
                const clientId = row[0];
                if (clientId && clientUpdates.has(clientId.toString())) {
                    const update = clientUpdates.get(clientId.toString())!;
                    row[vistoIndex] = update.visto;
                    row[comentarioIndex] = update.comentario;
                }
            }
            finalData = dataToExport;
        } else { // 'filtered'
            const filteredClientIds = new Set(finalFilteredClients.map(c => c.id));
            const filteredRows = [headers];
    
            for (let i = 1; i < dataToExport.length; i++) {
                const row = dataToExport[i];
                const clientId = row[0] ? row[0].toString() : null;
    
                if (clientId && filteredClientIds.has(clientId)) {
                    if (clientUpdates.has(clientId)) {
                        const update = clientUpdates.get(clientId)!;
                        row[vistoIndex] = update.visto;
                        row[comentarioIndex] = update.comentario;
                    }
                    filteredRows.push(row);
                }
            }
            finalData = filteredRows;
        }
    
        const worksheet = XLSX.utils.aoa_to_sheet(finalData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes Actualizados");
        XLSX.writeFile(workbook, "clientes_actualizados.xlsx");
    };
    
    const totalPages = Math.ceil(finalFilteredClients.length / CLIENTS_PER_PAGE);
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * CLIENTS_PER_PAGE;
        const endIndex = startIndex + CLIENTS_PER_PAGE;
        return finalFilteredClients.slice(startIndex, endIndex);
    }, [finalFilteredClients, currentPage]);

    const handleClientSelect = (client: Client | null) => {
        setSelectedClientId(client ? client.id : null);
    };

    return (
        <>
            {isProcessingFile && <LoadingOverlay />}
            <div className="flex flex-col h-screen font-sans bg-slate-100">
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    activeView={activeView}
                    onNavClick={handleNavClick}
                    isDatabaseUnlocked={scriptLoaded}
                    onFileChange={handleFile}
                    loading={loading}
                    fileError={fileError}
                    isSettingCenter={isSettingCenter}
                    onSetCenterClick={() => { setIsSettingCenter(true); setIsSidebarOpen(false); }}
                    radiusMeters={radiusMeters}
                    onRadiusChange={setRadiusMeters}
                    onExport={handleExport}
                    referencePoint={referencePoint}
                    filteredClients={finalFilteredClients}
                    paginatedClients={paginatedClients}
                    selectedClientId={selectedClientId}
                    onClientSelect={handleClientSelect}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    showOnlyNewClients={showOnlyNewClients}
                    onShowOnlyNewClientsChange={setShowOnlyNewClients}
                    clients={clients}
                />

                <main className="flex-grow min-h-0">
                    {activeView === 'inicio' && <InicioPage />}
                    {activeView === 'calculadora' && <CalculadoraSolarPage />}
                    {activeView === 'nosotros' && <NosotrosPage />}
                    {activeView === 'potenciales' && (
                        <>
                            {scriptLoaded ? (
                                <MapComponent 
                                    onMapLoad={handleMapLoad}
                                    paginatedClients={paginatedClients}
                                    filteredClients={finalFilteredClients}
                                    referencePoint={referencePoint}
                                    radiusMeters={radiusMeters}
                                    isSettingCenter={isSettingCenter}
                                    onSetReferencePoint={setReferencePoint}
                                    onIsSettingCenterChange={setIsSettingCenter}
                                    onClientSelect={handleClientSelect}
                                    onUpdateClient={handleUpdateClient}
                                    selectedClientId={selectedClientId}
                                    infoWindowRef={infoWindowRef}
                                />
                            ) : (
                                <ApiKeyGate onSubmit={handleKeySubmit} error={apiKeyError} isLoading={isLoadingScript} />
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
};

export default App;
