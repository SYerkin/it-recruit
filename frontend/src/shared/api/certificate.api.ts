import { apiClient } from './client';

export interface Certificate {
  id: number;
  candidateProfileId: number;
  name: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificatesResponse {
  success: boolean;
  data: Certificate[];
}

export interface CreateCertificateRequest {
  name: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export const certificateApi = {
  getMyCertificates: async (): Promise<CertificatesResponse> => {
    const response = await apiClient.get<CertificatesResponse>('/certificates');
    return response.data;
  },

  createCertificate: async (data: CreateCertificateRequest): Promise<{ success: boolean; data: Certificate }> => {
    const response = await apiClient.post<{ success: boolean; data: Certificate }>('/certificates', data);
    return response.data;
  },

  updateCertificate: async (id: number, data: CreateCertificateRequest): Promise<{ success: boolean; data: Certificate }> => {
    const response = await apiClient.put<{ success: boolean; data: Certificate }>(`/certificates/${id}`, data);
    return response.data;
  },

  deleteCertificate: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/certificates/${id}`);
    return response.data;
  },
};

