import { apiClient } from './client';
import { Job } from './job.api';

export interface FavoriteJobsResponse {
  success: boolean;
  data: Job[];
}

export interface CheckFavoriteResponse {
  success: boolean;
  data: { isFavorite: boolean };
}

export const favoriteApi = {
  getMyFavoriteJobs: async (): Promise<FavoriteJobsResponse> => {
    const response = await apiClient.get<FavoriteJobsResponse>('/favorites');
    return response.data;
  },

  addFavoriteJob: async (jobId: number): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>('/favorites', { jobId });
    return response.data;
  },

  removeFavoriteJob: async (jobId: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/favorites/${jobId}`);
    return response.data;
  },

  checkFavoriteJob: async (jobId: number): Promise<CheckFavoriteResponse> => {
    const response = await apiClient.get<CheckFavoriteResponse>(`/favorites/check/${jobId}`);
    return response.data;
  },
};

