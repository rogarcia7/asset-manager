export interface Asset {
  id: number;
  serialNumber: string;
  name: string;
  purchaseDate?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para criar/editar (sem ID)
export interface AssetPayload {
  serialNumber: string;
  name: string;
  purchaseDate?: string | null;
  status: string;
}