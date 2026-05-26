import { BrowserRouter, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AppRoutes } from './routes/AppRoutes';

const AUTH_PATHS = ['/login', '/signup', '/forgot-password'];

const Layout = () => {
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main>
        <AppRoutes />
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <MobileBottomNav />}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(15, 34, 64, 0.95)',
            color: '#f0f4ff',
            border: '1px solid rgba(255, 107, 53, 0.4)',
            backdropFilter: 'blur(12px)',
          },
          success: { iconTheme: { primary: '#ff6b35', secondary: '#0a1628' } },
          error: { iconTheme: { primary: '#e74c3c', secondary: '#fff' } },
        }}
      />
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <TripProvider>
                <Layout />
              </TripProvider>
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
