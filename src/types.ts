export interface Client {
    id: string;
    name: string;
    lat: number;
    lng: number;
    phone: string;
    amount: number;
    distance?: number;
}
