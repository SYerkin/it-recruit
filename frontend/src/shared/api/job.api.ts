import { apiClient } from './client';

export interface Job {
  id: number;
  title: string;
  description: string;
  responsibilities?: string;
  benefits?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency: string;
  status: string;
  viewsCount?: number;
  workSchedule?: string | null;
  workMode?: string | null;
  workType?: string | null;
  experienceLevel?: string | null;
  companyId: number;
  company?: {
    id: number;
    name: string;
    address?: string;
    employeeCount?: string;
  };
  requiredSkills?: Array<{
    skill: {
      id: number;
      name: string;
    };
  }>;
  creatorId?: number;
  creator?: {
    id: number;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  success: boolean;
  data: Job[];
}

export interface JobResponse {
  success: boolean;
  data: Job;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  responsibilities?: string;
  benefits?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  status?: string;
  companyId?: number;
  requiredSkillIds?: number[];
  workSchedule?: string;
  workMode?: string;
  workType?: string;
  experienceLevel?: string;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  responsibilities?: string;
  benefits?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string;
  status?: string;
  requiredSkillIds?: number[];
  workSchedule?: string | null;
  workMode?: string | null;
  workType?: string | null;
  experienceLevel?: string | null;
}

export interface RecommendedCandidate {
  candidateProfileId: number;
  userId: number;
  firstName: string;
  lastName: string;
  headline?: string | null;
  isOpenToWork: boolean;
  matchScore: number;
  matchedSkills: string[];
  skills: Array<{
    name: string;
    proficiencyLevel: string;
    yearsOfExperience?: number | null;
  }>;
}

export interface RecommendedCandidatesResponse {
  success: boolean;
  data: RecommendedCandidate[];
}

export const jobApi = {
  getJobs: async (params?: {
    search?: string;
    minSalary?: number;
    skill?: string;
    status?: string;
    companyId?: number;
    trending?: boolean;
    limit?: number;
  }): Promise<JobsResponse> => {
    const response = await apiClient.get<JobsResponse>('/jobs', { 
      params: {
        ...params,
        trending: params?.trending ? 'true' : undefined,
      },
    });
    return response.data;
  },

  getJobById: async (id: number): Promise<JobResponse> => {
    const response = await apiClient.get<JobResponse>(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: CreateJobRequest): Promise<JobResponse> => {
    const response = await apiClient.post<JobResponse>('/jobs', data);
    return response.data;
  },

  updateJob: async (id: number, data: UpdateJobRequest): Promise<JobResponse> => {
    const response = await apiClient.put<JobResponse>(`/jobs/${id}`, data);
    return response.data;
  },

  getRecommendedCandidates: async (id: number, limit = 3): Promise<RecommendedCandidatesResponse> => {
    const response = await apiClient.get<RecommendedCandidatesResponse>(`/jobs/${id}/recommended-candidates`, {
      params: { limit },
    });
    return response.data;
  },
};

