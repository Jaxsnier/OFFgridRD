export interface Client {
    id: string;
    name: string;
    lat: number;
    lng: number;
    phone: string;
    amount: number;
    address: string;
    distance?: number;
    visto: 0 | 1;
    comentario: string;
}