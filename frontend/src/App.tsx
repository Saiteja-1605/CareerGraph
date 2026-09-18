import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ProfilePage } from './pages/student/ProfilePage';
import { SkillsPage } from './pages/student/SkillsPage';
import { DsaTrackerPage } from './pages/student/DsaTrackerPage';
import { InterviewPrepPage } from './pages/student/InterviewPrepPage';
import { OpportunitiesPage } from './pages/student/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/student/OpportunityDetailPage';
import { ApplicationsPage } from './pages/student/ApplicationsPage';
import { SettingsPage } from './pages/student/SettingsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageStudentsPage } from './pages/admin/ManageStudentsPage';
import { ManageOpportunitiesPage } from './pages/admin/ManageOpportunitiesPage';
import { ManageApplicationsPage } from './pages/admin/ManageApplicationsPage';
import { ManageSkillsPage } from './pages/admin/ManageSkillsPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';

// Authenticated Layout Wrapper
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard')) return 'Student Dashboard';
    if (path.includes('/profile')) return 'Profile Management';
    if (path.includes('/skills')) return 'Technical Skills Matrix';
    if (path.includes('/dsa')) return 'DSA Preparation Tracker';
    if (path.includes('/interview-prep')) return 'Interview Preparation';
    if (path.includes('/opportunities/')) return 'Placement Drive Details';
    if (path.includes('/opportunities')) return 'Campus Placement Drives';
    if (path.includes('/applications')) return 'Placement Applications';
    if (path.includes('/settings')) return 'Account Settings';
    if (path.includes('/admin/students')) return 'Student Directory';
    if (path.includes('/admin/opportunities')) return 'Manage Placement Drives';
    if (path.includes('/admin/applications')) return 'Manage Applications';
    if (path.includes('/admin/skills')) return 'Master Skills Catalog';
    if (path.includes('/admin/analytics')) return 'Placement Intelligence';
    if (path.includes('/admin')) return 'Directorate Dashboard';
    return 'CareerGraph';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          title={getPageTitle(location.pathname)}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === 'admin' || user?.role === 'lecturer'
                  ? '/admin'
                  : user?.role === 'industry'
                  ? '/admin/opportunities'
                  : '/dashboard'
              }
              replace
            />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === 'admin' || user?.role === 'lecturer'
                  ? '/admin'
                  : user?.role === 'industry'
                  ? '/admin/opportunities'
                  : '/dashboard'
              }
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === 'admin' || user?.role === 'lecturer'
                  ? '/admin'
                  : user?.role === 'industry'
                  ? '/admin/opportunities'
                  : '/dashboard'
              }
              replace
            />
          ) : (
            <RegisterPage />
          )
        }
      />

      {/* Student & Alumni Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student', 'alumni']}>
            <AuthenticatedLayout>
              <StudentDashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'lecturer', 'alumni', 'industry']}>
            <AuthenticatedLayout>
              <ProfilePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute allowedRoles={['student', 'alumni']}>
            <AuthenticatedLayout>
              <SkillsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dsa"
        element={
          <ProtectedRoute allowedRoles={['student', 'alumni']}>
            <AuthenticatedLayout>
              <DsaTrackerPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-prep"
        element={
          <ProtectedRoute allowedRoles={['student', 'alumni']}>
            <AuthenticatedLayout>
              <InterviewPrepPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-preparation"
        element={
          <ProtectedRoute allowedRoles={['student', 'alumni']}>
            <AuthenticatedLayout>
              <InterviewPrepPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/opportunities"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'lecturer', 'alumni', 'industry']}>
            <AuthenticatedLayout>
              <OpportunitiesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/opportunities/:id"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'lecturer', 'alumni', 'industry']}>
            <AuthenticatedLayout>
              <OpportunityDetailPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute allowedRoles={['student', 'alumni']}>
            <AuthenticatedLayout>
              <ApplicationsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'lecturer', 'alumni', 'industry']}>
            <AuthenticatedLayout>
              <SettingsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin, Faculty, and Industry Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lecturer']}>
            <AuthenticatedLayout>
              <AdminDashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lecturer', 'industry', 'alumni']}>
            <AuthenticatedLayout>
              <ManageStudentsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/opportunities"
        element={
          <ProtectedRoute allowedRoles={['admin', 'industry']}>
            <AuthenticatedLayout>
              <ManageOpportunitiesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lecturer', 'industry']}>
            <AuthenticatedLayout>
              <ManageApplicationsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lecturer']}>
            <AuthenticatedLayout>
              <ManageSkillsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lecturer']}>
            <AuthenticatedLayout>
              <AnalyticsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
