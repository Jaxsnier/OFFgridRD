
import { useState, useEffect, useRef, useCallback } from 'react';

export const useGoogleMapsAPI = (initialKey?: string, onValidKey?: (key: string) => void) => {
    const [apiKey, setApiKey] = useState<string>(initialKey || '');
    const [loadTrigger, setLoadTrigger] = useState<number>(0);
    const [apiKeyError, setApiKeyError] = useState<string>('');
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [isLoadingScript, setIsLoadingScript] = useState<boolean>(false);
    
    const authFailedRef = useRef(false);
    const onValidKeyRef = useRef(onValidKey);

    useEffect(() => {
        onValidKeyRef.current = onValidKey;
    }, [onValidKey]);

    const loadScript = useCallback((key: string) => {
        if (!key.trim()) {
            setApiKey('');
            setScriptLoaded(false);
            setIsLoadingScript(false);
            setApiKeyError('');
            return;
        }
        
        // Manual trigger
        setApiKey(key.trim());
        setApiKeyError('');
        setScriptLoaded(false);
        setIsLoadingScript(true); // Start loading UI
        setLoadTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        // STRICT GUARD: If no trigger has been fired, do NOT start the effect logic.
        // This ensures pre-filling doesn't start the loading process.
        if (loadTrigger === 0 || !apiKey) {
            return;
        }

        setIsLoadingScript(true);
        setApiKeyError('');
        authFailedRef.current = false;

        const cleanupGoogleAPI = () => {
            const script = document.getElementById('google-maps-script');
            if (script) script.remove();
            delete (window as any).initMapSuccess;
            delete (window as any).gm_authFailure;
        };

        const timeoutId = setTimeout(() => {
            if (isLoadingScript && !scriptLoaded && !apiKeyError) {
                setIsLoadingScript(false);
                setApiKeyError("La conexión con Google Maps ha tardado demasiado. Intenta de nuevo.");
            }
        }, 15000);

        const handleAuthError = (errorMessage = "La clave de API es incorrecta.") => {
            if (authFailedRef.current) return;
            authFailedRef.current = true;
            
            clearTimeout(timeoutId);
            setApiKeyError(errorMessage);
            setIsLoadingScript(false);
            setScriptLoaded(false);
            cleanupGoogleAPI();
        };

        const handleSuccess = () => {
            if (authFailedRef.current) return;
            
            clearTimeout(timeoutId);
            try {
                if (!(window as any).google || !(window as any).google.maps) {
                    throw new Error("API object not found");
                }
                
                new (window as any).google.maps.Geocoder();
                
                setScriptLoaded(true);
                setIsLoadingScript(false);
                setApiKeyError('');
                
                if (onValidKeyRef.current) {
                    onValidKeyRef.current(apiKey);
                }
            } catch (error) {
                handleAuthError("Error al inicializar las librerías de Google Maps.");
            }
        };
        
        cleanupGoogleAPI();

        (window as any).initMapSuccess = handleSuccess;
        (window as any).gm_authFailure = () => handleAuthError();

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=geometry&callback=initMapSuccess`;
        script.async = true;
        script.defer = true;
        script.onerror = () => handleAuthError("Error de red al cargar Google Maps.");
        
        document.head.appendChild(script);

        return () => {
            clearTimeout(timeoutId);
            cleanupGoogleAPI();
        };
    }, [apiKey, loadTrigger]);
    
    return {
        scriptLoaded,
        isLoadingScript,
        apiKeyError,
        loadScript,
    };
};
