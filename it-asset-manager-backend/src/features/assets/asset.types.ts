export interface Asset {
    id?: number; 
    serialNumber: string;
    name: string;
    purchaseDate?: string; 
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AssetBody {
    serialNumber: string;
    name: string;
    purchaseDate?: string;
    status?: string;
}