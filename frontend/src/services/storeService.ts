import api from './api';

export interface Store {
  id: number;
  name: string;
  email?: string;
  address: string;
}

export interface Rating {
  id: number;
  storeId: number;
  userId: number;
  rating: number;
  user?: { id: number; name: string; email: string };
  createdAt?: string;
}

export const storeService = {
  fetchStores: async (): Promise<Store[]> => {
    const res = await api.get('/stores');
    return res.data;
  },

  fetchStoreById: async (id: number): Promise<Store | null> => {
    const res = await api.get(`/stores/${id}`);
    return res.data;
  },

  fetchStoreRatings: async (storeId: number): Promise<Rating[]> => {
    const res = await api.get(`/ratings/store/${storeId}`);
    return res.data;
  },

  submitRating: async (storeId: number, rating: number): Promise<void> => {
    await api.post('/ratings', { storeId, rating });
  }
};