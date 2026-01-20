
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
        setApiKey(key.trim());
        setApiKeyError('');
        setScriptLoaded(false);
        setIsLoadingScript(true);
        // Increment trigger to force useEffect even if apiKey is the same
        setLoadTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        // Only run if there is a key and a trigger has been fired
        if (!apiKey || loadTrigger === 0) {
            return;
        }

        setIsLoadingScript(true);
        setApiKeyError('');
        authFailedRef.current = false;

        const cleanupGoogleAPI = () => {
            const script = document.getElementById('google-maps-script');
            if (script) script.remove();
            
            // Clean up global callbacks
            delete (window as any).initMapSuccess;
            delete (window as any).gm_authFailure;
            
            // Note: window.google usually persists, but we can't fully delete it safely
            // without affecting other possible scripts. We just stop the script loading.
        };

        // Safety timeout to prevent infinite spinner if script fails to report back
        const timeoutId = setTimeout(() => {
            if (isLoadingScript && !scriptLoaded && !apiKeyError) {
                setIsLoadingScript(false);
                setApiKeyError("Tiempo de espera agotado. Verifica tu conexión o la clave de API.");
            }
        }, 12000);

        const handleAuthError = (errorMessage = "La clave de API es incorrecta o no está autorizada.") => {
            if (authFailedRef.current) return;
            authFailedRef.current = true;
            
            clearTimeout(timeoutId);
            setApiKeyError(errorMessage);
            setIsLoadingScript(false);
            setScriptLoaded(false);
            // Important: We DON'T clear apiKey state here to avoid re-triggering this effect
            cleanupGoogleAPI();
        };

        const handleSuccess = () => {
            if (authFailedRef.current) return;
            
            clearTimeout(timeoutId);
            try {
                if (!(window as any).google || !(window as any).google.maps) {
                    throw new Error("Google Maps object not found");
                }
                
                // Minimal check to ensure Geocoder (part of basic maps) is available
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
        script.onerror = () => handleAuthError("No se pudo cargar el recurso de Google Maps. Verifica tu conexión.");
        
        document.head.appendChild(script);

        return () => {
            clearTimeout(timeoutId);
            cleanupGoogleAPI();
        };
    }, [apiKey, loadTrigger]); // Depends on trigger to allow retrying the same key
    
    return {
        scriptLoaded,
        isLoadingScript,
        apiKeyError,
        loadScript,
    };
};
