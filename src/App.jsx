import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Jobs from './pages/Jobs';
import About from './pages/About';
import Match from './pages/Match';
import Employers from './pages/Employers';
import Legal from './pages/Legal';
import Network from './pages/Network';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';

const SecurityGuard = () => {
  const location = useLocation();

  useEffect(() => {
    // If we were in admin and moved out, clear the token
    // We check for /admin/ or /admin exactly
    const isAdminRoute = (path) => path.startsWith('/admin') || path === '/admin';

    // We can't easily know 'previous' path without a ref, 
    // but we can check if current is NOT admin and token exists.
    // To make it strict: if NOT on admin route, clear it.
    if (!isAdminRoute(location.pathname)) {
      if (sessionStorage.getItem('adminToken')) {
        console.log("Navigating away from admin: locking dashboard.");
        sessionStorage.removeItem('adminToken');
      }
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <SecurityGuard />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="about" element={<About />} />
          <Route path="match" element={<Match />} />
          <Route path="employers" element={<Employers />} />
          <Route path="legal" element={<Legal />} />
          <Route path="network" element={<Network />} />
          <Route path="login" element={<Login />} />
          <Route
            path="admin"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
