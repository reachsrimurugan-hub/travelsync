import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { GridSkeleton } from '../components/LoadingSkeleton';

const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })));
const Discover = lazy(() => import('../pages/Discover').then((m) => ({ default: m.Discover })));
const Planner = lazy(() => import('../pages/Planner').then((m) => ({ default: m.Planner })));
const AIAssistant = lazy(() => import('../pages/AIAssistant').then((m) => ({ default: m.AIAssistant })));
const Login = lazy(() => import('../pages/Login').then((m) => ({ default: m.Login })));
const Signup = lazy(() => import('../pages/Signup').then((m) => ({ default: m.Signup })));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const Dashboard = lazy(() => import('../pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Profile = lazy(() => import('../pages/Profile').then((m) => ({ default: m.Profile })));
const SavedTrips = lazy(() => import('../pages/SavedTrips').then((m) => ({ default: m.SavedTrips })));
const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFound })));

const PageLoader = () => (
  <div className="container page-wrapper">
    <GridSkeleton count={3} />
  </div>
);

const guest = (element) => <GuestRoute>{element}</GuestRoute>;
const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/planner" element={protect(<Planner />)} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
      <Route path="/login" element={guest(<Login />)} />
      <Route path="/signup" element={guest(<Signup />)} />
      <Route path="/forgot-password" element={guest(<ForgotPassword />)} />
      <Route path="/dashboard" element={protect(<Dashboard />)} />
      <Route path="/profile" element={protect(<Profile />)} />
      <Route path="/saved" element={protect(<SavedTrips />)} />
      <Route path="/saved-trips" element={<Navigate to="/saved" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
