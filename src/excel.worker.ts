/// <reference lib="webworker" />
import type { Client } from './types';

// Since we are in a worker, we can't use npm modules directly.
// We import the xlsx library, which is loaded in the main HTML file.
declare var XLSX: any;

self.onmessage = async (event: MessageEvent<ArrayBuffer>) => {
    try {
        // Dynamically import the xlsx script if it's not already available.
        if (typeof XLSX === 'undefined') {
            (self as any).importScripts('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
        }

        const data = event.data;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (json.length < 2) {
            throw new Error("El archivo está vacío o no tiene datos.");
        }

        // Indices basados en estructura típica de archivos de EDES:
        // 0: ID, 3: Sector, 4: Calle, 5: No. Casa / Puerta, 8-10: Nombres, 11: Teléfono, 47: Monto, 52: Lat, 53: Lng
        const vistoIndex = 78; // Column CA
        const comentarioIndex = 80; // Column CC

        const parsedClients: Client[] = json.slice(1).map((row: any) => {
            const firstName = row[8] || '';
            const lastName1 = row[9] || '';
            const lastName2 = row[10] || '';
            const fullName = `${firstName} ${lastName1} ${lastName2}`.trim().replace(/\s+/g, ' ');

            // Extracción de dirección: Calle + Numero de Puerta, Sector
            const sector = row[3] || '';
            const calle = row[4] || '';
            const numeroPuerta = row[5] || '';
            
            // Construimos la dirección limpia
            const addressParts = [];
            if (calle) addressParts.push(calle);
            if (numeroPuerta) addressParts.push(`#${numeroPuerta}`);
            const streetLine = addressParts.join(' ');
            
            const fullAddress = sector 
                ? `${streetLine}${streetLine ? ', ' : ''}${sector}`
                : streetLine;

            return {
                id: row[0] != null ? String(row[0]) : '',
                name: fullName || 'Sin Nombre',
                lat: parseFloat(row[52]), // Column BK
                lng: parseFloat(row[53]), // Column BL
                phone: row[11] || 'N/A',
                amount: parseFloat(row[47]) || 0,
                address: fullAddress.trim() || 'Dirección no especificada',
                visto: (parseInt(row[vistoIndex]) === 1 ? 1 : 0) as (0 | 1),
                comentario: row[comentarioIndex] || ''
            };
        }).filter(client => client.id && !isNaN(client.lat) && !isNaN(client.lng));
        
        // Post the processed data back to the main thread
        self.postMessage({ clients: parsedClients, originalData: json });

    } catch (error: any) {
        // If an error occurs, post it back to the main thread
        self.postMessage({ error: error.message });
    }
};