import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import Logs from './pages/Logs';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/employees" element={
            <PrivateRoute><Employees /></PrivateRoute>
          } />
          <Route path="/teams" element={
            <PrivateRoute><Teams /></PrivateRoute>
          } />
          <Route path="/logs" element={
            <PrivateRoute><Logs /></PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
