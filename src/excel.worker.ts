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

        // Mapeo de columnas basado en el feedback del usuario:
        // P (15): calle
        // Q (16): numero_puerta
        // R (17): referencia_direccion
        // I, J, K (8, 9, 10): Nombres y Apellidos
        // L (11): Teléfono
        // AV (47): Monto / Consumo
        // BK (52): Latitud
        // BL (53): Longitud
        // CA (78): Visto
        // CC (80): Comentario

        const vistoIndex = 78;
        const comentarioIndex = 80;

        const parsedClients: Client[] = json.slice(1).map((row: any) => {
            const firstName = row[8] || '';
            const lastName1 = row[9] || '';
            const lastName2 = row[10] || '';
            const fullName = `${firstName} ${lastName1} ${lastName2}`.trim().replace(/\s+/g, ' ');

            // Extracción de dirección utilizando P, Q, R
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

            return {
                id: row[0] != null ? String(row[0]) : '',
                name: fullName || 'Sin Nombre',
                lat: parseFloat(row[52]),
                lng: parseFloat(row[53]),
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
        self.postMessage({ error: error.message });
    }
};