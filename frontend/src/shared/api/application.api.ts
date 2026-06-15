import { apiClient } from './client';

export interface Application {
  id: number;
  jobId: number;
  candidateProfileId: number;
  status: string;
  coverLetter?: string;
  job?: {
    id: number;
    title: string;
    status: string;
    company?: {
      id: number;
      name: string;
      address?: string;
    };
    requiredSkills?: Array<{
      skill: {
        id: number;
        name: string;
      };
    }>;
    creator?: {
      id: number;
      email: string;
      telegramUsername?: string | null;
    };
  };
  candidateProfile?: {
    id: number;
    firstName: string;
    lastName: string;
    headline?: string;
    user: {
      id: number;
      email: string;
      telegramUsername?: string | null;
    };
    skills?: Array<{
      skill: {
        id: number;
        name: string;
      };
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
      degree: string;
      institution: string;
      fieldOfStudy?: string;
      startDate: string;
      endDate?: string;
    }>;
    certificates?: Array<{
      id: number;
      title: string;
      issuer?: string;
      issueDate: string;
    }>;
  };
  feedbacks?: ApplicationFeedback[];
  statusHistory?: ApplicationStatusHistoryItem[];
  averageRating?: number | null;
  averageRatingsByCriterion?: Record<string, number> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationStatusHistoryItem {
  id: number;
  fromStatus?: string | null;
  toStatus: string;
  changedById?: number | null;
  changedByRole?: string | null;
  note?: string | null;
  createdAt: string;
  changedBy?: {
    id: number;
    email: string;
    role: string;
  } | null;
}

export interface ApplicationFeedback {
  id: number;
  applicationId: number;
  authorId: number;
  authorRole?: string;
  targetRole?: string;
  rating: number;
  criteriaRatings?: Record<string, number> | null;
  comment: string | null;
  author?: { id: number; email: string; role: string };
  createdAt: string;
}

export interface ApplicationsResponse {
  success: boolean;
  data: Application[];
}

export interface ApplyJobRequest {
  coverLetter?: string;
}

export const applicationApi = {
  applyForJob: async (jobId: number, data: ApplyJobRequest): Promise<{ success: boolean; data: Application }> => {
    const response = await apiClient.post<{ success: boolean; data: Application }>(`/applications/jobs/${jobId}/apply`, data);
    return response.data;
  },

  getMyApplications: async (): Promise<ApplicationsResponse> => {
    const response = await apiClient.get<ApplicationsResponse>('/applications/me');
    return response.data;
  },

  getMyJobApplications: async (): Promise<ApplicationsResponse> => {
    const response = await apiClient.get<ApplicationsResponse>('/applications/my');
    return response.data;
  },

  getJobApplications: async (jobId: number): Promise<ApplicationsResponse> => {
    const response = await apiClient.get<ApplicationsResponse>(`/applications/jobs/${jobId}`);
    return response.data;
  },

  getApplicationById: async (id: number): Promise<{ success: boolean; data: Application }> => {
    const response = await apiClient.get<{ success: boolean; data: Application }>(`/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id: number, status: string): Promise<{ success: boolean; data: Application }> => {
    const response = await apiClient.put<{ success: boolean; data: Application }>(`/applications/${id}/status`, { status });
    return response.data;
  },

  submitFeedback: async (id: number, data: { rating: number; criteriaRatings?: Record<string, number> | null; comment?: string | null }): Promise<{ success: boolean; data: ApplicationFeedback }> => {
    const response = await apiClient.post<{ success: boolean; data: ApplicationFeedback }>(`/applications/${id}/feedback`, data);
    return response.data;
  },

  getFeedbacks: async (id: number): Promise<{ success: boolean; data: { feedbacks: ApplicationFeedback[]; averageRating: number | null; averageRatingsByCriterion: Record<string, number> | null } }> => {
    const response = await apiClient.get<{ success: boolean; data: { feedbacks: ApplicationFeedback[]; averageRating: number | null; averageRatingsByCriterion: Record<string, number> | null } }>(`/applications/${id}/feedback`);
    return response.data;
  },

  getChat: async (applicationId: number): Promise<{ success: boolean; data: { conversation: { id: number; applicationId: number }; messages: ChatMessage[] } }> => {
    const response = await apiClient.get<{ success: boolean; data: { conversation: { id: number; applicationId: number }; messages: ChatMessage[] } }>(`/applications/${applicationId}/chat`);
    return response.data;
  },

  sendChatMessage: async (applicationId: number, payload: { body?: string; attachment?: string; attachmentName?: string }): Promise<{ success: boolean; data: ChatMessage }> => {
    const response = await apiClient.post<{ success: boolean; data: ChatMessage }>(`/applications/${applicationId}/chat/messages`, payload);
    return response.data;
  },

  markChatRead: async (applicationId: number, lastMessageId: number): Promise<{ success: boolean; data: { marked: number } }> => {
    const response = await apiClient.post<{ success: boolean; data: { marked: number } }>(`/applications/${applicationId}/chat/read`, { lastMessageId });
    return response.data;
  },
};

export interface ChatMessage {
  id: number;
  conversationId: number;
  authorId: number;
  body: string | null;
  attachmentName: string | null;
  attachmentPath: string | null;
  attachmentUrl?: string | null;
  readAt: string | null;
  author?: { id: number; email: string; role: string };
  createdAt: string;
}