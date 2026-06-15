import { apiClient } from './client';

export const feedbackApi = {
  send: (data: { name: string; email: string; type: string; message: string }) =>
    apiClient.post('/feedback', data).then((r) => r.data),

  applyMentor: (data: {
    name: string;
    email: string;
    currentTitle: string;
    experienceYears: number;
    skills: string;
    bio: string;
    motivation: string;
  }) => apiClient.post('/feedback/mentor-applications', data).then((r) => r.data),
};
