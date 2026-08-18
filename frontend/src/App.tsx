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
import { LeaderboardView } from '@/views/analytics/LeaderboardView';
import { QuizHistoryView } from '@/views/analytics/QuizHistoryView';
import { TrainingAnalytics } from '@/views/analytics/TrainingAnalytics';
import { AuditAnalytics } from '@/views/analytics/AuditAnalytics';
import { SopViewer } from '@/views/sop/SopViewer';
import { SopManagement } from '@/views/sop/SopManagement';

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
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginView />} />

          {/* Authenticated Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardView />} />
            
            {/* Courses & Library */}
            <Route path="/library" element={<LibraryView />} />
            <Route path="/library/course/:id" element={<LibraryDetailView />} />
            <Route path="/library/generate-quiz" element={<LibraryQuizGenerate />} />
            <Route path="/quiz-builder" element={<QuizBuilderView />} />

            {/* Employees */}
            <Route path="/employees" element={<EmployeeManagement />} />

            {/* Audit */}
            <Route path="/outlets" element={<OutletManagement />} />
            <Route path="/checklist-builder" element={<ChecklistBuilder />} />
            <Route path="/audit-reports" element={<AuditAnalytics />} />

            {/* Analytics */}
            <Route path="/analytics/leaderboard" element={<LeaderboardView />} />
            <Route path="/analytics/quiz-history" element={<QuizHistoryView />} />
            <Route path="/analytics/training/in-class" element={<TrainingAnalytics />} />
            <Route path="/analytics/training/on-site" element={<TrainingAnalytics />} />
            <Route path="/analytics/training/online" element={<TrainingAnalytics />} />
            <Route path="/analytics/audit" element={<AuditAnalytics />} />

            {/* SOP */}
            <Route path="/sop/viewer" element={<SopViewer />} />
            <Route path="/sop/management" element={<SopManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
