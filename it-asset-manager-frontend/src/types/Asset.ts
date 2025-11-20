// src/types/Asset.ts

// A interface Asset precisa ser igual à do backend para garantir a tipagem correta
export interface Asset {
    id: number;
    serialNumber: string;
    name: string;
    purchaseDate: string | null; // string (ISO Date) no JS/TS, nulo ou opcional
    status: string;
    createdAt: string;
    updatedAt: string;
}