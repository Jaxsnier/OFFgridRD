
import { useState, useEffect, useRef, useCallback } from 'react';

export const useGoogleMapsAPI = (initialKey?: string, onValidKey?: (key: string) => void) => {
    const [apiKey, setApiKey] = useState<string>(initialKey || '');
    const [apiKeyError, setApiKeyError] = useState<string>('');
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [isLoadingScript, setIsLoadingScript] = useState<boolean>(false);
    
    const authFailedRef = useRef(false);
    // Ref to keep track of the latest callback without triggering effect re-runs
    const onValidKeyRef = useRef(onValidKey);

    useEffect(() => {
        onValidKeyRef.current = onValidKey;
    }, [onValidKey]);

    const loadScript = useCallback((key: string) => {
        setScriptLoaded(false);
        setApiKeyError('');
        if (key) {
            setIsLoadingScript(true);
        } else {
            setIsLoadingScript(false);
        }
        setApiKey(key);
    }, []);

    useEffect(() => {
        if (!apiKey) {
            setIsLoadingScript(false);
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

        const handleAuthError = (errorMessage = "La clave de API es incorrecta o no está autorizada.") => {
            if (authFailedRef.current) return;
            authFailedRef.current = true;
            
            setApiKeyError(errorMessage);
            setApiKey('');
            setIsLoadingScript(false);
            setScriptLoaded(false);
            cleanupGoogleAPI();
        };

        const handleSuccess = () => {
            if (authFailedRef.current) return;
            
            try {
                // Confirm google object exists
                if (!(window as any).google || !(window as any).google.maps) {
                    throw new Error("Google Maps not loaded");
                }
                
                new (window as any).google.maps.Geocoder();
                
                setScriptLoaded(true);
                setIsLoadingScript(false);
                setApiKeyError('');
                
                // Trigger the callback if provided
                if (onValidKeyRef.current) {
                    onValidKeyRef.current(apiKey);
                }
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
    }, [apiKey]);
    
    return {
        scriptLoaded,
        isLoadingScript,
        apiKeyError,
        loadScript,
    };
};
