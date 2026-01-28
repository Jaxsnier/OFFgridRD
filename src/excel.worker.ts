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

        // Obtener cabeceras para búsqueda dinámica
        const headers = json[0].map(h => h?.toString().toLowerCase().trim() || '');
        
        // Buscamos los índices de 'visto' y 'comentario' por nombre
        // Esto permite que el archivo funcione incluso si las columnas se agregaron al final tras una exportación
        let vistoIndex = headers.indexOf('visto');
        let comentarioIndex = headers.indexOf('comentario');

        // Fallbacks históricos si no se encuentran por nombre (basados en estructura original de EDES)
        if (vistoIndex === -1) vistoIndex = 78; // Columna CA
        if (comentarioIndex === -1) comentarioIndex = 80; // Columna CC

        const parsedClients: Client[] = json.slice(1).map((row: any) => {
            const firstName = row[8] || '';
            const lastName1 = row[9] || '';
            const lastName2 = row[10] || '';
            const fullName = `${firstName} ${lastName1} ${lastName2}`.trim().replace(/\s+/g, ' ');

            // Extracción de dirección utilizando P, Q, R (15, 16, 17)
            const calle = row[15] != null ? String(row[15]).trim() : '';
            const numeroPuerta = row[16] != null ? String(row[16]).trim() : '';
            const referencia = row[17] != null ? String(row[17]).trim() : '';
            
            // Construcción de la dirección: Calle #Puerta (Referencia)
            let addressParts = [];
            if (calle) addressParts.push(calle);
            if (numeroPuerta) addressParts.push(`#${numeroPuerta}`);
            
            let fullAddress = addressParts.join(' ');
            if (referencia) {
                fullAddress += fullAddress ? ` (${referencia})` : referencia;
            }

            // Lectura de estado visto y comentario
            // Aseguramos que el valor de visto sea estrictamente 0 o 1
            const vistoRaw = row[vistoIndex];
            const vistoValue = (vistoRaw === 1 || vistoRaw === '1') ? 1 : 0;
            const comentarioValue = row[comentarioIndex] != null ? String(row[comentarioIndex]).trim() : '';

            return {
                id: row[0] != null ? String(row[0]) : '',
                name: fullName || 'Sin Nombre',
                lat: parseFloat(row[52]),
                lng: parseFloat(row[53]),
                phone: row[11] || 'N/A',
                amount: parseFloat(row[47]) || 0,
                address: fullAddress.trim() || 'Dirección no especificada',
                visto: vistoValue as (0 | 1),
                comentario: comentarioValue
            };
        }).filter(client => client.id && !isNaN(client.lat) && !isNaN(client.lng));
        
        // Post the processed data back to the main thread
        self.postMessage({ clients: parsedClients, originalData: json });

    } catch (error: any) {
        self.postMessage({ error: error.message });
    }
};
