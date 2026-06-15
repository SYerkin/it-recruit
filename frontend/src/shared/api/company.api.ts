import { apiClient } from './client';

export interface Company {
  id: number;
  name: string;
  description?: string;
  address?: string;
  address2gis?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  socialLinks?: Record<string, string> | null;
  foundedYear?: number;
  officePhotos?: string[];
  isVerified?: boolean;
  employeeCount?: string;
  documents?: string[];
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  jobs?: any[];
}

export interface CreateCompanyRequest {
  name: string;
  description?: string;
  address?: string;
  address2gis?: string;
  logoUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  socialLinks?: Record<string, string> | null;
  foundedYear?: number | null;
  employeeCount?: string;
  documents?: string[];
  officePhotos?: string[];
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string | null;
  address?: string | null;
  address2gis?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  socialLinks?: Record<string, string> | null;
  foundedYear?: number | null;
  employeeCount?: string | null;
  documents?: string[] | null;
  officePhotos?: string[] | null;
}

export interface CompanyResponse {
  success: boolean;
  data: Company;
  message?: string;
}

export interface CompaniesResponse {
  success: boolean;
  data: Company[];
}

export interface CompanyVerificationStatusResponse {
  success: boolean;
  data: {
    isVerified: boolean;
    request: {
      id: number;
      status: string;
      adminComment?: string | null;
      comment?: string | null;
      documents: Array<{ name?: string; url: string }>;
      createdAt: string;
      reviewedAt?: string | null;
    } | null;
  };
}

export const companyApi = {
  create: async (data: CreateCompanyRequest): Promise<CompanyResponse> => {
    const response = await apiClient.post<CompanyResponse>('/companies', data);
    return response.data;
  },

  getMyCompany: async (): Promise<CompanyResponse> => {
    try {
      const response = await apiClient.get<CompanyResponse>('/companies/me');
      return response.data;
    } catch (error: any) {
      // Если компания не найдена (404), возвращаем null вместо ошибки
      if (error.response?.status === 404) {
        throw new Error('COMPANY_NOT_FOUND');
      }
      throw error;
    }
  },

  getAllCompanies: async (): Promise<CompaniesResponse> => {
    const response = await apiClient.get<CompaniesResponse>('/companies');
    return response.data;
  },

  update: async (data: UpdateCompanyRequest): Promise<CompanyResponse> => {
    const response = await apiClient.put<CompanyResponse>('/companies', data);
    return response.data;
  },

  getById: async (id: number): Promise<CompanyResponse> => {
    const response = await apiClient.get<CompanyResponse>(`/companies/${id}`);
    return response.data;
  },

  getFeatured: async (limit?: number): Promise<CompaniesResponse> => {
    const response = await apiClient.get<CompaniesResponse>('/companies/featured', {
      params: limit ? { limit } : undefined,
    });
    return response.data;
  },

  uploadLogo: async (file: File): Promise<{ success: boolean; data: { url: string } }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/companies/upload-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadDocument: async (file: File): Promise<{ success: boolean; data: { url: string; name: string } }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/companies/upload-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  createVerificationRequest: async (payload: {
    documents: Array<{ name?: string; url: string }>;
    comment?: string;
  }): Promise<{ success: boolean; data: any }> => {
    const response = await apiClient.post('/companies/verification-request', payload);
    return response.data;
  },

  getVerificationStatus: async (companyId: number): Promise<CompanyVerificationStatusResponse> => {
    const response = await apiClient.get<CompanyVerificationStatusResponse>(`/companies/${companyId}/verification-status`);
    return response.data;
  },

  getHrReviews: async (companyId: number): Promise<{ success: boolean; data: { averageRating: number | null; totalReviews: number; reviews: any[] } }> => {
    const response = await apiClient.get(`/companies/${companyId}/hr-reviews`);
    return response.data;
  },
};

