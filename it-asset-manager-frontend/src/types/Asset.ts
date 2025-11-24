
export interface Asset {
    id: number;
    serialNumber: string;
    name: string;
    purchaseDate: string | null; // string (ISO Date) no JS/TS, nulo ou opcional
    status: string;
    createdAt: string;
    updatedAt: string;
}