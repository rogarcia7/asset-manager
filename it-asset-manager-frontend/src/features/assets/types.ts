export interface Asset {
  id: number;
  serialNumber: string;
  name: string;
  purchaseDate?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface AssetPayload {
  serialNumber: string;
  name: string;
  purchaseDate?: string | null;
  status: string;
}
