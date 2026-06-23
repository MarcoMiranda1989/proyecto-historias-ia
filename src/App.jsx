import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import CreateStory from './pages/CreateStory';
import StoryView from './pages/StoryView';
import AddPage from './pages/AddPage';

// Redirección inicial
function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>}
        />
        <Route
          path="/create"
          element={<ProtectedRoute><PageTransition><CreateStory /></PageTransition></ProtectedRoute>}
        />
        <Route
          path="/story/:id"
          element={<ProtectedRoute><PageTransition><StoryView /></PageTransition></ProtectedRoute>}
        />
        <Route
          path="/story/:id/add"
          element={<ProtectedRoute><PageTransition><AddPage /></PageTransition></ProtectedRoute>}
        />
      </Routes>
    </AnimatePresence>
  );
}

// App principal
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-zinc-50 flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <AnimatedRoutes />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;