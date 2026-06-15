import React from 'react';
import styled from 'styled-components';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { HomePage } from '@pages/HomePage';
import { UserTypeSelection } from '@pages/Auth/UserTypeSelection';
import { Register } from '@pages/Auth/Register';
import { Login } from '@pages/Auth/Login';
import { ForgotPassword } from '@pages/Auth/ForgotPassword';
import { CreateCompany } from '@pages/Company/CreateCompany';
import { EditCompany } from '@pages/Company/EditCompany';
import { Dashboard } from '@pages/Dashboard';
import { Jobs } from '@pages/Jobs';
import { CreateJob } from '@pages/Jobs/CreateJob';
import { JobDetails } from '@pages/Jobs/JobDetails';
import { Companies, CompanyDetails } from '@pages/Companies';
import { Candidates, CandidateDetails } from '@pages/Candidates';
import { ApplicationDetails } from '@pages/Applications';
import { RecommendationsPage } from '@pages/Recommendations';
import { ResumeBuilder } from '@pages/ResumeBuilder';
import { HRKanban, CandidateTimeline } from '@pages/HiringTracking';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import { MentorsPage, MentorProfilePage } from '@pages/Mentors';
import { AdminLayout } from '@pages/Admin';
import { FeedbackButton } from '@widgets/FeedbackButton';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
`;

const MainContent = styled.main<{ $flat?: boolean }>`
  flex: 1;
  max-width: ${({ $flat }) => ($flat ? 'none' : '1200px')};
  width: 100%;
  margin: 0 auto;
  padding: ${({ $flat }) => ($flat ? '0' : 'var(--spacing-2xl) var(--spacing-lg)')};
  
  @media (max-width: 768px) {
    padding: ${({ $flat }) => ($flat ? '0' : 'var(--spacing-xl) var(--spacing-md)')};
  }
`;

export const Layout: React.FC = () => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname.startsWith('/auth') || location.pathname === '/resume' || location.pathname.startsWith('/admin');
  
  const hideFeedback = location.pathname.startsWith('/admin');
  const flatMainContent =
    /^\/candidates\/\d+/.test(location.pathname) ||
    location.pathname === '/dashboard' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/auth';

  return (
    <LayoutContainer>
      {!hideHeader && <Header />}
      {!hideFeedback && <FeedbackButton />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/resume" element={<ResumeBuilder />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <MainContent $flat={flatMainContent}>
              <Routes>
                <Route path="/auth" element={<UserTypeSelection />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/mentors/:id" element={<MentorProfilePage />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <Candidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates/:id"
            element={
              <ProtectedRoute>
                <CandidateDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/create"
            element={
              <ProtectedRoute>
                <CreateCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/edit"
            element={
              <ProtectedRoute>
                <EditCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute>
                <CreateJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={<JobDetails />}
          />
                <Route
                  path="/applications/:id"
                  element={
                    <ProtectedRoute>
                      <ApplicationDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs/:jobId/hiring"
                  element={
                    <ProtectedRoute>
                      <HRKanban />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications/:applicationId/tracking"
                  element={
                    <ProtectedRoute>
                      <CandidateTimeline />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </MainContent>
          }
        />
      </Routes>
    </LayoutContainer>
  );
};

