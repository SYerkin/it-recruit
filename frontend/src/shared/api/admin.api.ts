import { apiClient } from './client';

export interface AdminStats {
  users: { total: number; hr: number; candidates: number };
  companies: number;
  verifiedCompanies?: number;
  activeJobs: number;
  applications: { total: number; byStatus: Record<string, number> };
  mentors: number;
  pendingVerifications: number;
  unreadFeedback: number;
}

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  profile?: { firstName: string; lastName: string } | null;
  company?: { id: number; name: string } | null;
}

export interface AdminApplication {
  id: number;
  status: string;
  createdAt: string;
  job: { id: number; title: string; company: { id: number; name: string } };
  candidateProfile: { id: number; firstName: string; lastName: string };
}

export interface FeedbackMessage {
  id: number;
  userId?: number;
  name: string;
  email: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface MentorApplication {
  id: number;
  name: string;
  email: string;
  currentTitle: string;
  experienceYears: number;
  skills: string;
  bio: string;
  motivation: string;
  status: string;
  adminComment?: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: number;
  status: string;
  comment?: string | null;
  adminComment?: string | null;
  documents: Array<{ name?: string; url: string }>;
  createdAt: string;
  reviewedAt?: string | null;
  company: { id: number; name: string };
  submittedBy: { id: number; email: string };
  reviewedBy?: { id: number; email: string } | null;
}

export const adminApi = {
  getStats: () =>
    apiClient.get<{ success: boolean; data: AdminStats }>('/admin/stats').then((r) => r.data),

  getCompanies: () =>
    apiClient.get('/admin/companies').then((r) => r.data),

  getApplications: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ success: boolean; data: { applications: AdminApplication[]; total: number } }>('/admin/applications', { params }).then((r) => r.data),

  getUsers: (params?: { role?: string; search?: string }) =>
    apiClient.get<{ success: boolean; data: AdminUser[] }>('/admin/users', { params }).then((r) => r.data),

  resetPassword: (userId: number, newPassword: string) =>
    apiClient.post(`/admin/users/${userId}/reset-password`, { newPassword }).then((r) => r.data),

  getFeedback: (params?: { type?: string; isRead?: boolean }) =>
    apiClient.get<{ success: boolean; data: FeedbackMessage[] }>('/admin/feedback', { params }).then((r) => r.data),

  markFeedbackRead: (id: number) =>
    apiClient.patch(`/admin/feedback/${id}/read`).then((r) => r.data),

  getMentorApplications: (params?: { status?: string }) =>
    apiClient.get<{ success: boolean; data: MentorApplication[] }>('/admin/mentor-applications', { params }).then((r) => r.data),

  updateMentorApplication: (id: number, data: { status: string; adminComment?: string }) =>
    apiClient.patch(`/admin/mentor-applications/${id}`, data).then((r) => r.data),

  getVerificationRequests: () =>
    apiClient.get<{ success: boolean; data: VerificationRequest[] }>('/admin/verification-requests').then((r) => r.data),

  updateVerificationRequest: (id: number, data: { status: 'APPROVED' | 'REJECTED'; adminComment?: string }) =>
    apiClient.patch(`/admin/verification-requests/${id}`, data).then((r) => r.data),
};
