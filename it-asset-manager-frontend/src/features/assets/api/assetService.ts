import { api } from '../../../lib/axios';
import type { Asset, AssetPayload } from '../types';

export const assetService = {
  getAll: async () => {
    const response = await api.get<Asset[]>('/assets');
    return response.data;
  },

  create: async (data: AssetPayload) => {
    const response = await api.post<Asset>('/assets', data);
    return response.data;
  },

  update: async (id: number, data: AssetPayload) => {
    const response = await api.put<Asset>(`/assets/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/assets/${id}`);
  }
};