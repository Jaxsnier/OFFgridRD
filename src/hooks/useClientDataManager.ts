import { useState, useMemo, useEffect } from 'react';
import { Client } from '../types';

declare var XLSX: any;
const CLIENTS_PER_PAGE = 1500;

export const useClientDataManager = (scriptLoaded: boolean) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [originalData, setOriginalData] = useState<any[][]>([]);
    
    const [radiusMeters, setRadiusMeters] = useState<number>(300);
    const [referencePoint, setReferencePoint] = useState<any | null>(null);
    const [showOnlyNewClients, setShowOnlyNewClients] = useState<boolean>(false);
    
    const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
    const [fileError, setFileError] = useState<string>('');
    
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessingFile(true);
        setFileError('');
        setClients([]);
        setOriginalData([]);
        setCurrentPage(1);
        setReferencePoint(null);

        try {
            const data = await file.arrayBuffer();
            
            const worker = new Worker(new URL('../excel.worker.ts', import.meta.url));

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
                        
                        const defaultLatLng = new (window as any).google.maps.LatLng(19.461620, -70.662102);
                        setReferencePoint(defaultLatLng);
                    }
                }
                
                setIsProcessingFile(false);
                worker.terminate();
            };

            worker.onerror = (err) => {
                setFileError(`Error en el worker: ${err.message}`);
                setIsProcessingFile(false);
                worker.terminate();
            };

            worker.postMessage(data);

        } catch (err: any) {
            setFileError(`Error al leer el archivo: ${err.message}`);
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
        setCurrentPage(1);
    }, [finalFilteredClients.length]);

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

    return {
        clients,
        isProcessingFile,
        fileError,
        handleFile,
        finalFilteredClients,
        paginatedClients,
        totalPages,
        currentPage,
        onPageChange: setCurrentPage,
        selectedClientId,
        handleClientSelect,
        handleUpdateClient,
        handleExport,
        radiusMeters,
        onRadiusChange: setRadiusMeters,
        referencePoint,
        onSetReferencePoint: setReferencePoint,
        showOnlyNewClients,
        onShowOnlyNewClientsChange: setShowOnlyNewClients,
    };
};
