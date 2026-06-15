import { apiClient } from './client';

export interface Mentor {
  id: number;
  name: string;
  avatarUrl?: string;
  title: string;
  company?: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  pricePerSession: number;
  sessionDuration: number;
  isActive: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface MentorRequest {
  id: number;
  mentorId: number;
  userId: number;
  name: string;
  email: string;
  message: string;
  goal: string;
  status: string;
  createdAt: string;
}

export interface MentorReview {
  id: number;
  mentorId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { id: number; email: string };
}

export const mentorApi = {
  getAll: (params?: { skill?: string; free?: boolean; search?: string; minPrice?: number; maxPrice?: number }) =>
    apiClient.get<{ success: boolean; data: Mentor[] }>('/mentors', { params }).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<{ success: boolean; data: Mentor & { reviews: MentorReview[] } }>(`/mentors/${id}`).then((r) => r.data),

  getReviews: (id: number) =>
    apiClient.get<{ success: boolean; data: MentorReview[] }>(`/mentors/${id}/reviews`).then((r) => r.data),

  createRequest: (id: number, data: { name: string; email: string; message: string; goal: string }) =>
    apiClient.post<{ success: boolean; data: MentorRequest }>(`/mentors/${id}/request`, data).then((r) => r.data),

  paySession: (id: number, data: { requestId: number; cardNumber: string; cardHolder: string }) =>
    apiClient.post<{ success: boolean; data: { paymentId: number; cardLast4: string } }>(`/mentors/${id}/pay`, data).then((r) => r.data),

  createReview: (id: number, data: { rating: number; comment?: string }) =>
    apiClient.post(`/mentors/${id}/reviews`, data).then((r) => r.data),

  // Admin
  create: (data: Partial<Mentor>) =>
    apiClient.post<{ success: boolean; data: Mentor }>('/mentors', data).then((r) => r.data),

  update: (id: number, data: Partial<Mentor>) =>
    apiClient.put<{ success: boolean; data: Mentor }>(`/mentors/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/mentors/${id}`).then((r) => r.data),
};
