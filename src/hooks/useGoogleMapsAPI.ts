import { useState, useEffect, useRef, useCallback } from 'react';

export const useGoogleMapsAPI = (initialKey?: string) => {
    const [apiKey, setApiKey] = useState<string>(initialKey || '');
    const [apiKeyError, setApiKeyError] = useState<string>('');
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [isLoadingScript, setIsLoadingScript] = useState<boolean>(false);
    
    const authFailedRef = useRef(false);

    const loadScript = useCallback((key: string) => {
        setScriptLoaded(false);
        setApiKey(key);
    }, []);

    useEffect(() => {
        if (!apiKey) return;

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
    }, [apiKey]);
    
    return {
        scriptLoaded,
        isLoadingScript,
        apiKeyError,
        loadScript,
    };
};
