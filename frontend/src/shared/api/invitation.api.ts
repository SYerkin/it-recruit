import { apiClient } from './client';

export interface Invitation {
  id: number;
  jobId: number;
  candidateProfileId: number;
  status: string;
  message?: string;
  expiresAt?: string;
  job?: {
    id: number;
    title: string;
    description: string;
    salaryMin?: number;
    salaryMax?: number;
    currency: string;
  };
  candidateProfile?: {
    id: number;
    firstName: string;
    lastName: string;
    headline?: string;
  };
  invitedBy?: {
    id: number;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvitationsResponse {
  success: boolean;
  data: Invitation[];
}

export interface CreateInvitationRequest {
  jobId: number;
  candidateProfileId: number;
  message?: string;
  expiresAt?: string;
}

export interface AcceptInvitationResponseData extends Invitation {
  application?: {
    id: number;
    status: string;
    jobId?: number;
  };
}

export const invitationApi = {
  createInvitation: async (data: CreateInvitationRequest): Promise<{ success: boolean; data: Invitation }> => {
    const response = await apiClient.post<{ success: boolean; data: Invitation }>('/invitations', data);
    return response.data;
  },

  getMyInvitations: async (): Promise<InvitationsResponse> => {
    const response = await apiClient.get<InvitationsResponse>('/invitations/me');
    return response.data;
  },

  acceptInvitation: async (id: number): Promise<{ success: boolean; data: AcceptInvitationResponseData }> => {
    const response = await apiClient.put<{ success: boolean; data: AcceptInvitationResponseData }>(`/invitations/${id}/accept`);
    return response.data;
  },

  declineInvitation: async (id: number): Promise<{ success: boolean; data: Invitation }> => {
    const response = await apiClient.put<{ success: boolean; data: Invitation }>(`/invitations/${id}/decline`);
    return response.data;
  },

  getJobInvitations: async (jobId: number): Promise<InvitationsResponse> => {
    const response = await apiClient.get<InvitationsResponse>(`/invitations/jobs/${jobId}`);
    return response.data;
  },
};

