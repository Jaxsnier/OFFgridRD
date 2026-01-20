
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { db } from './src/firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useTheme } from './src/hooks/useTheme';
import { useGoogleMapsAPI } from './src/hooks/useGoogleMapsAPI';
import { useClientDataManager } from './src/hooks/useClientDataManager';
import { useAuth } from './src/hooks/useAuth';

import ApiKeyGate from './src/components/ApiKeyGate';
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar';
import MapComponent from './src/components/MapComponent';
import NosotrosPage from './src/components/NosotrosPage';
import LoadingOverlay from './src/components/LoadingOverlay';
import InicioPage from './src/components/InicioPage';
import CalculadoraSolarPage from './src/components/CalculadoraSolarPage';
import InstalacionPersonalizadaPage from './src/components/InstalacionPersonalizadaPage';

export type View = 'inicio' | 'calculadora' | 'instalacion_personalizada' | 'potenciales' | 'nosotros';

// Fix: Declare XLSX to inform TypeScript that it's a global variable.
declare var XLSX: any;

const App: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    const [activeView, setActiveView] = useState<View>('inicio');
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isCheckingDbKey, setIsCheckingDbKey] = useState<boolean>(false);
    const [dbApiKey, setDbApiKey] = useState<string>('');
    
    // Auth
    const auth = useAuth();
    
    // Callback to save the API key to Firestore when it's confirmed valid
    const handleGoogleMapsKeyValid = useCallback(async (validKey: string) => {
        if (auth.user) {
            try {
                const userRef = doc(db, 'users', auth.user.uid);
                await setDoc(userRef, { googleMapsApiKey: validKey }, { merge: true });
                console.log('API Key validada y guardada en Firestore.');
            } catch (error) {
                console.error('Error al guardar la API Key en Firestore:', error);
            }
        }
    }, [auth.user]);

    // Google Maps API Hook
    const { scriptLoaded, isLoadingScript, apiKeyError, loadScript } = useGoogleMapsAPI(undefined, handleGoogleMapsKeyValid);
    
    // Track previous user to detect logout
    const prevUserRef = useRef(auth.user);

    // Effect: Handle Logout (Clear Key and Unload)
    useEffect(() => {
        if (prevUserRef.current && !auth.user) {
            console.log('Detectado cierre de sesión. Limpiando datos sensibles.');
            setDbApiKey('');
            loadScript(''); // This safely unloads everything
        }
        prevUserRef.current = auth.user;
    }, [auth.user, loadScript]);
    
    // Effect: Pre-fill API Key from Firestore when user logs in
    useEffect(() => {
        let isMounted = true;
        
        const fetchUserKey = async () => {
            // Only fetch if: User exists, Map not loaded, not already checking, and field is empty
            if (auth.user && !scriptLoaded && !isCheckingDbKey && !dbApiKey) {
                setIsCheckingDbKey(true);
                try {
                    const userRef = doc(db, 'users', auth.user.uid);
                    const userSnap = await getDoc(userRef);
                    
                    if (isMounted && userSnap.exists()) {
                        const userData = userSnap.data();
                        if (userData && userData.googleMapsApiKey) {
                            console.log('Clave de API encontrada en Firestore. Pre-llenando campo.');
                            setDbApiKey(userData.googleMapsApiKey);
                        }
                    }
                } catch (error) {
                    console.error("Error al recuperar la API Key de Firestore:", error);
                } finally {
                    if (isMounted) setIsCheckingDbKey(false);
                }
            }
        };

        fetchUserKey();
        return () => { isMounted = false; };
    }, [auth.user, scriptLoaded, isCheckingDbKey, dbApiKey]);

    // Client Data Management
    const clientData = useClientDataManager(scriptLoaded);

    // Map specific state
    const [map, setMap] = useState<any>(null);
    const [isSettingCenter, setIsSettingCenter] = useState<boolean>(false);
    const infoWindowRef = useRef<any>(null);
    
    const handleMapLoad = useCallback((mapInstance: any) => {
        setMap(mapInstance);
        infoWindowRef.current = new (window as any).google.maps.InfoWindow();
    }, []);

    const handleKeySubmit = (submittedKey: string) => {
        console.log('Iniciando carga manual de mapa...');
        loadScript(submittedKey);
    };

    const handleNavClick = (view: View) => {
        setActiveView(view);
    };

    return (
        <>
            {clientData.isProcessingFile && <LoadingOverlay />}
            <div className="bg-slate-50 dark:bg-slate-900 flex flex-col h-screen font-sans transition-colors duration-300">
                <Header 
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    user={auth.user}
                />
                
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    activeView={activeView}
                    onNavClick={handleNavClick}
                    isDatabaseUnlocked={scriptLoaded}
                    isSettingCenter={isSettingCenter}
                    onSetCenterClick={() => { setIsSettingCenter(true); setIsSidebarOpen(false); }}
                    clientDataManager={clientData}
                    auth={auth}
                />

                <main className="flex-grow min-h-0">
                    {activeView === 'inicio' && <InicioPage />}
                    {activeView === 'calculadora' && <CalculadoraSolarPage />}
                    {activeView === 'instalacion_personalizada' && <InstalacionPersonalizadaPage />}
                    {activeView === 'nosotros' && <NosotrosPage />}
                    {activeView === 'potenciales' && (
                        <>
                            {scriptLoaded ? (
                                <MapComponent 
                                    onMapLoad={handleMapLoad}
                                    paginatedClients={clientData.paginatedClients}
                                    filteredClients={clientData.finalFilteredClients}
                                    referencePoint={clientData.referencePoint}
                                    radiusMeters={clientData.radiusMeters}
                                    isSettingCenter={isSettingCenter}
                                    onSetReferencePoint={clientData.onSetReferencePoint}
                                    onIsSettingCenterChange={setIsSettingCenter}
                                    onClientSelect={clientData.handleClientSelect}
                                    onUpdateClient={clientData.handleUpdateClient}
                                    selectedClientId={clientData.selectedClientId}
                                    infoWindowRef={infoWindowRef}
                                />
                            ) : (
                                <ApiKeyGate 
                                    onSubmit={handleKeySubmit} 
                                    error={apiKeyError} 
                                    isLoading={isLoadingScript || isCheckingDbKey} 
                                    initialValue={dbApiKey}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
};

export default App;
