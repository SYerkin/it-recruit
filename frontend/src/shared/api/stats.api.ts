import { apiClient } from './client';

export interface PublicStats {
  activeJobs: number;
  companies: number;
  candidates: number;
  avgTimeToOffer: number;
}

export interface StatsResponse {
  success: boolean;
  data: PublicStats;
}

export const statsApi = {
  getPublicStats: async (): Promise<StatsResponse> => {
    const response = await apiClient.get<StatsResponse>('/stats/public');
    return response.data;
  },
};
