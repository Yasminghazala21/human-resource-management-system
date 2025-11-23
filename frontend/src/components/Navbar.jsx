import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand">
          <h2>HRMS</h2>
        </Link>
        
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/employees" className="nav-link">Employees</Link>
          <Link to="/teams" className="nav-link">Teams</Link>
          <Link to="/logs" className="nav-link">Logs</Link>
        </div>

        <div className="nav-user">
          <span className="user-name">{user?.name}</span>
          <span className="org-name">{user?.organisationName}</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
