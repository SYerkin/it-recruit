import { apiClient } from './client';

export interface Candidate {
  id: number;
  email: string;
  role: string;
  profile?: {
    id: number;
    firstName: string;
    lastName: string;
    phone?: string;
    headline?: string;
    summary?: string;
    isOpenToWork: boolean;
    viewsCount?: number;
    skills?: Array<{
      skill: {
        id: number;
        name: string;
      };
      proficiencyLevel?: string;
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
      credentialUrl?: string;
    }>;
  };
}

export interface CandidatesResponse {
  success: boolean;
  data: Candidate[];
}

export interface CandidateResponse {
  success: boolean;
  data: Candidate;
}

export interface CandidateReviewsResponse {
  success: boolean;
  data: {
    averageRating: number | null;
    totalReviews: number;
    reviews: Array<{
      id: number;
      rating: number;
      comment?: string | null;
      criteriaRatings?: Record<string, number> | null;
      createdAt: string;
      application?: { id: number; status: string; job?: { id: number; title: string; company?: { id: number; name: string } } };
    }>;
  };
}

export interface CandidateProfileViewersResponse {
  success: boolean;
  data: {
    totalViews: number;
    uniqueViewers: number;
    viewers: Array<{
      id: number;
      viewsCount: number;
      firstViewedAt: string;
      lastViewedAt: string;
      hr: {
        id: number;
        email: string;
        role: string;
        company: { id: number; name: string } | null;
      };
    }>;
  };
}

export const candidateApi = {
  getCandidates: async (params?: { search?: string; skill?: string; isOpenToWork?: boolean }): Promise<CandidatesResponse> => {
    const response = await apiClient.get<CandidatesResponse>('/candidates', { params });
    return response.data;
  },

  getCandidateById: async (id: number): Promise<CandidateResponse> => {
    const response = await apiClient.get<CandidateResponse>(`/candidates/${id}`);
    return response.data;
  },

  getCandidateReviews: async (id: number): Promise<CandidateReviewsResponse> => {
    const response = await apiClient.get<CandidateReviewsResponse>(`/candidates/${id}/reviews`);
    return response.data;
  },

  getMyProfileViewers: async (): Promise<CandidateProfileViewersResponse> => {
    const response = await apiClient.get<CandidateProfileViewersResponse>('/candidates/me/profile-viewers');
    return response.data;
  },
};

