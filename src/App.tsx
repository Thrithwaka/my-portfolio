import { useEffect, useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { CinematicPortfolio } from './components/CinematicPortfolio';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Navbar } from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { Lenis as ReactLenis } from 'lenis/react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  const isAdmin = user?.email === 'thrithwakapreethi57@gmail.com';

  return (
    <ReactLenis root>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
          <Navbar user={user} />
          <Routes>
            <Route path="/" element={<CinematicPortfolio />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/login" element={user ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
            <Route 
              path="/admin/dashboard/*" 
              element={isAdmin ? <AdminDashboard user={user!} /> : <Navigate to="/admin/login" />} 
            />
          </Routes>
        </div>
      </Router>
    </ReactLenis>
  );
}

export default App;
