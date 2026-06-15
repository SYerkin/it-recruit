import { apiClient } from './client';

export interface CandidateProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone?: string;
  headline?: string;
  summary?: string;
  cvFileUrl?: string;
  isOpenToWork: boolean;
  isPublicProfile: boolean;
  skills?: Array<{
    skill: {
      id: number;
      name: string;
    };
    proficiencyLevel: string;
    yearsOfExperience?: number;
  }>;
  workExperiences?: Array<{
    id: number;
    companyName: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  educations?: Array<{
    id: number;
    institution: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  certificates?: Array<{
    id: number;
    name: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  data: CandidateProfile;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  headline?: string;
  summary?: string;
  cvFileUrl?: string;
  isOpenToWork?: boolean;
  isPublicProfile?: boolean;
}

export interface WorkExperience {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  id: number;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export const profileApi = {
  getMyProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>('/profile/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    const response = await apiClient.put<ProfileResponse>('/profile/me', data);
    return response.data;
  },

  addExperience: async (data: {
    companyName: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }): Promise<{ success: boolean; data: WorkExperience }> => {
    const response = await apiClient.post<{ success: boolean; data: WorkExperience }>('/profile/experience', data);
    return response.data;
  },

  updateExperience: async (id: number, data: Partial<WorkExperience>): Promise<{ success: boolean; data: WorkExperience }> => {
    const response = await apiClient.put<{ success: boolean; data: WorkExperience }>(`/profile/experience/${id}`, data);
    return response.data;
  },

  deleteExperience: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/profile/experience/${id}`);
    return response.data;
  },

  addEducation: async (data: {
    institution: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }): Promise<{ success: boolean; data: Education }> => {
    const response = await apiClient.post<{ success: boolean; data: Education }>('/profile/education', data);
    return response.data;
  },

  updateEducation: async (id: number, data: Partial<Education>): Promise<{ success: boolean; data: Education }> => {
    const response = await apiClient.put<{ success: boolean; data: Education }>(`/profile/education/${id}`, data);
    return response.data;
  },

  deleteEducation: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/profile/education/${id}`);
    return response.data;
  },
};

