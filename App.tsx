import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Client } from './src/types';
import ApiKeyGate from './src/components/ApiKeyGate';
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar';
import MapComponent from './src/components/MapComponent';
import NosotrosPage from './src/components/NosotrosPage';
import LoadingOverlay from './src/components/LoadingOverlay';
import InicioPage from './src/components/InicioPage';

type View = 'inicio' | 'potenciales' | 'nosotros';

const App: React.FC = () => {
    // State Management
    const [clients, setClients] = useState<Client[]>([]);
    const [originalData, setOriginalData] = useState<any[][]>([]);
    const [map, setMap] = useState<any>(null);
    
    const [radiusKm, setRadiusKm] = useState<number>(2);
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
        setReferencePoint(null); // Reset reference point on new file load

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (json.length < 2) {
                throw new Error("El archivo está vacío o no tiene datos.");
            }
            
            setOriginalData(json);

            const headers = json[0].map(h => h?.toString().toLowerCase().trim());
            const vistoIndex = headers.indexOf('visto');
            const comentarioIndex = headers.indexOf('comentario');

            const parsedClients: Client[] = json.slice(1).map((row: any) => {
                const firstName = row[8] || '';
                const lastName1 = row[9] || '';
                const lastName2 = row[10] || '';
                const fullName = `${firstName} ${lastName1} ${lastName2}`.trim().replace(/\s+/g, ' ');

                return {
                    id: row[0] != null ? String(row[0]) : '',
                    name: fullName,
                    lat: parseFloat(row[52]),
                    lng: parseFloat(row[53]),
                    phone: row[11] || 'N/A',
                    amount: parseFloat(row[47]) || 0,
                    visto: (vistoIndex !== -1 ? (parseInt(row[vistoIndex]) === 1 ? 1 : 0) : 0) as (0 | 1),
                    comentario: comentarioIndex !== -1 ? row[comentarioIndex] || '' : ''
                };
            }).filter(client => client.id && client.name && !isNaN(client.lat) && !isNaN(client.lng));

            if (parsedClients.length === 0) {
                throw new Error("No se encontraron clientes con datos de latitud y longitud válidos.");
            }

            setClients(parsedClients);
            
            // Set default reference point after data is loaded
            const defaultLatLng = new (window as any).google.maps.LatLng(19.461620, -70.662102);
            setReferencePoint(defaultLatLng);

        } catch (err: any) {
            setFileError(`Error al procesar el archivo: ${err.message}`);
        } finally {
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
            }).filter(client => (client.distance! / 1000) <= radiusKm);
    
            clientsInRadius.sort((a, b) => a.distance! - b.distance!);
            filtered = clientsInRadius;
        }

        if (showOnlyNewClients) {
            filtered = filtered.filter(client => client.visto === 0);
        }
        
        return filtered;
    }, [clients, referencePoint, radiusKm, showOnlyNewClients, scriptLoaded]);

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
                    radiusKm={radiusKm}
                    onRadiusChange={setRadiusKm}
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
                    {activeView === 'nosotros' && <NosotrosPage />}
                    {activeView === 'potenciales' && (
                        <>
                            {scriptLoaded ? (
                                <MapComponent 
                                    onMapLoad={handleMapLoad}
                                    paginatedClients={paginatedClients}
                                    filteredClients={finalFilteredClients}
                                    referencePoint={referencePoint}
                                    radiusKm={radiusKm}
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