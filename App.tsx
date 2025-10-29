import React, { useState, useRef, useCallback } from 'react';

import { useTheme } from './src/hooks/useTheme';
import { useGoogleMapsAPI } from './src/hooks/useGoogleMapsAPI';
import { useClientDataManager } from './src/hooks/useClientDataManager';

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
    
    // Google Maps API
    const { scriptLoaded, isLoadingScript, apiKeyError, loadScript } = useGoogleMapsAPI();
    
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
        loadScript(submittedKey);
    };

    const handleNavClick = (view: View) => {
        setActiveView(view);
        if (view === 'potenciales' && !scriptLoaded) {
            const savedApiKey = localStorage.getItem('googleMapsApiKey');
            if (savedApiKey) {
                loadScript(savedApiKey);
            }
        }
    };

    return (
        <>
            {clientData.isProcessingFile && <LoadingOverlay />}
            <div className="bg-slate-50 dark:bg-slate-900 flex flex-col h-screen font-sans transition-colors duration-300">
                <Header 
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
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