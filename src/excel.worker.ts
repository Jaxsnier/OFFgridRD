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

        const headers = json[0].map(h => h?.toString().toLowerCase().trim());
        const vistoIndex = 78; // Column CA
        const comentarioIndex = 80; // Column CC

        const parsedClients: Client[] = json.slice(1).map((row: any) => {
            const firstName = row[8] || '';
            const lastName1 = row[9] || '';
            const lastName2 = row[10] || '';
            const fullName = `${firstName} ${lastName1} ${lastName2}`.trim().replace(/\s+/g, ' ');

            // Extracción de dirección asumiendo columnas: Sector(3), Calle(4), No.(5)
            const sector = row[3] || '';
            const calle = row[4] || '';
            const casa = row[5] || '';
            const address = `${calle} ${casa}, ${sector}`.trim().replace(/^,|,$/g, '').replace(/\s+/g, ' ');

            return {
                id: row[0] != null ? String(row[0]) : '',
                name: fullName,
                lat: parseFloat(row[52]), // Column BK
                lng: parseFloat(row[53]), // Column BL
                phone: row[11] || 'N/A',
                amount: parseFloat(row[47]) || 0,
                address: address || 'Dirección no especificada',
                visto: (parseInt(row[vistoIndex]) === 1 ? 1 : 0) as (0 | 1),
                comentario: row[comentarioIndex] || ''
            };
        }).filter(client => client.id && client.name && !isNaN(client.lat) && !isNaN(client.lng));
        
        // Post the processed data back to the main thread
        self.postMessage({ clients: parsedClients, originalData: json });

    } catch (error: any) {
        // If an error occurs, post it back to the main thread
        self.postMessage({ error: error.message });
    }
};