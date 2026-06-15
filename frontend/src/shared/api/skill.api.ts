import { apiClient } from './client';

export interface Skill {
  id: number;
  name: string;
  category: string;
}

export interface SkillsResponse {
  success: boolean;
  data: Skill[];
}

export interface CreateSkillRequest {
  name: string;
  category?: string;
}

export const skillApi = {
  getAllSkills: async (params?: { category?: string; search?: string }): Promise<SkillsResponse> => {
    const response = await apiClient.get<SkillsResponse>('/skills', { params });
    return response.data;
  },

  createSkill: async (data: CreateSkillRequest): Promise<{ success: boolean; data: Skill }> => {
    const response = await apiClient.post<{ success: boolean; data: Skill }>('/skills', data);
    return response.data;
  },
};

