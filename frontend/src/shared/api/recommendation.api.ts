import { apiClient } from './client';

export interface RecommendationItem {
  id: number;
  categoryId: number;
  title: string;
  description?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  tags?: string[];
  isFree: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface RecommendationCategory {
  id: number;
  title: string;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
  items: RecommendationItem[];
}

export const recommendationApi = {
  getAll: async (): Promise<{ success: boolean; data: RecommendationCategory[] }> => {
    const response = await apiClient.get('/recommendations');
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<{ success: boolean; data: RecommendationCategory }> => {
    const response = await apiClient.get(`/recommendations/${categoryId}`);
    return response.data;
  },

  createCategory: async (data: { title: string; icon?: string; sortOrder?: number }): Promise<{ success: boolean; data: RecommendationCategory }> => {
    const response = await apiClient.post('/recommendations/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: { title?: string; icon?: string; sortOrder?: number; isActive?: boolean }): Promise<{ success: boolean; data: RecommendationCategory }> => {
    const response = await apiClient.put(`/recommendations/categories/${id}`, data);
    return response.data;
  },

  createItem: async (data: {
    categoryId: number;
    title: string;
    description?: string;
    url?: string;
    tags?: string[];
    isFree?: boolean;
    sortOrder?: number;
  }): Promise<{ success: boolean; data: RecommendationItem }> => {
    const response = await apiClient.post('/recommendations/items', data);
    return response.data;
  },

  updateItem: async (id: number, data: {
    title?: string;
    description?: string;
    url?: string;
    tags?: string[];
    isFree?: boolean;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<{ success: boolean; data: RecommendationItem }> => {
    const response = await apiClient.put(`/recommendations/items/${id}`, data);
    return response.data;
  },

  deleteItem: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/recommendations/items/${id}`);
    return response.data;
  },
};
