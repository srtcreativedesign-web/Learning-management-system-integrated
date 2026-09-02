import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppLayout } from '@/components/layout/AppLayout';
import { LoginView } from '@/views/LoginView';
import { DashboardView } from '@/views/DashboardView';
import { LibraryView } from '@/views/LibraryView';
import { LibraryDetailView } from '@/views/LibraryDetailView';
import { LibraryQuizGenerate } from '@/views/LibraryQuizGenerate';
import { QuizBuilderView } from '@/views/QuizBuilderView';
import { EmployeeManagement } from '@/views/EmployeeManagement';
import { OutletManagement } from '@/views/audit/OutletManagement';
import { ChecklistBuilder } from '@/views/audit/ChecklistBuilder';
import { InHouseChecklistBuilder } from '@/views/inhouse/InHouseChecklistBuilder';
import { InHouseSessionsView } from '@/views/inhouse/InHouseSessionsView';
import { LeaderboardView } from '@/views/analytics/LeaderboardView';
import { RankRewardsView } from '@/views/analytics/RankRewardsView';
import { QuizHistoryView } from '@/views/analytics/QuizHistoryView';
import { TrainingAnalytics } from '@/views/analytics/TrainingAnalytics';
import { AuditAnalytics } from '@/views/analytics/AuditAnalytics';
import { SopViewer } from '@/views/sop/SopViewer';
import { SopManagement } from '@/views/sop/SopManagement';
import { CertificateTemplatesView } from '@/views/certificates/CertificateTemplatesView';
import { IssuedCertificatesView } from '@/views/certificates/IssuedCertificatesView';
import { MyCertificatesView } from '@/views/MyCertificatesView';

import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginView />} />

            {/* Authenticated Dashboard Layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardView />} />
              
              {/* Courses & Library (Super Admin, HRBP, Trainer) */}
              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HRBP_MANAGER', 'TRAINER']} />}>
                <Route path="/library" element={<LibraryView />} />
                <Route path="/library/course/:id" element={<LibraryDetailView />} />
                <Route path="/library/generate-quiz" element={<LibraryQuizGenerate />} />
                <Route path="/quiz-builder" element={<QuizBuilderView />} />
                <Route path="/in-house/checklists" element={<InHouseChecklistBuilder />} />
                <Route path="/in-house/sessions" element={<InHouseSessionsView />} />
                <Route path="/analytics/quiz-history" element={<QuizHistoryView />} />
                <Route path="/analytics/training" element={<TrainingAnalytics />} />
                <Route path="/analytics/training-report" element={<TrainingAnalytics />} />
                <Route path="/analytics/training/in-class" element={<TrainingAnalytics />} />
                <Route path="/analytics/training/on-site" element={<TrainingAnalytics />} />
                <Route path="/analytics/training/online" element={<TrainingAnalytics />} />
              </Route>

              {/* Employees (Super Admin, HRBP, Trainer) */}
              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HRBP_MANAGER', 'TRAINER']} />}>
                <Route path="/employees" element={<EmployeeManagement />} />
              </Route>

              {/* Audit Lapangan (Super Admin, HRBP, Auditor) */}
              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HRBP_MANAGER', 'AUDITOR']} />}>
                <Route path="/outlets" element={<OutletManagement />} />
                <Route path="/checklist-builder" element={<ChecklistBuilder />} />
                <Route path="/audit-reports" element={<AuditAnalytics />} />
                <Route path="/analytics/audit" element={<AuditAnalytics />} />
              </Route>

              {/* Gamification & Leaderboard (Super Admin, HRBP, Trainer) */}
              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HRBP_MANAGER', 'TRAINER']} />}>
                <Route path="/analytics/leaderboard" element={<LeaderboardView />} />
                <Route path="/analytics/rank-rewards" element={<RankRewardsView />} />
              </Route>

              {/* SOP Viewer (All Roles) */}
              <Route path="/sop/viewer" element={<SopViewer />} />

              {/* SOP Management / Upload (Super Admin, HRBP) */}
              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HRBP_MANAGER']} />}>
                <Route path="/sop/management" element={<SopManagement />} />
              </Route>

              {/* Certificates (Super Admin, HRBP, Trainer) */}
              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HRBP_MANAGER', 'TRAINER']} />}>
                <Route path="/certificates/templates" element={<CertificateTemplatesView />} />
                <Route path="/certificates/issued" element={<IssuedCertificatesView />} />
              </Route>

              {/* My Certificates (All Authenticated Roles) */}
              <Route path="/certificates/mine" element={<MyCertificatesView />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
