import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import CreateStory from './pages/CreateStory';
import StoryView from './pages/StoryView';
import AddPage from './pages/AddPage';

function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/create"
              element={<ProtectedRoute><CreateStory /></ProtectedRoute>}
            />
            <Route
              path="/story/:id"
              element={<ProtectedRoute><StoryView /></ProtectedRoute>}
            />
            <Route
              path="/story/:id/add"
              element={<ProtectedRoute><AddPage /></ProtectedRoute>}
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
