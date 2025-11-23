import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI, teamAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    teams: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeesRes, teamsRes] = await Promise.all([
        employeeAPI.getAll(),
        teamAPI.getAll()
      ]);
      
      setStats({
        employees: employeesRes.data.count,
        teams: teamsRes.data.count
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Overview of your HRMS</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.employees}</h3>
              <p>Total Employees</p>
            </div>
            <Link to="/employees" className="stat-link">
              View all →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <h3>{stats.teams}</h3>
              <p>Total Teams</p>
            </div>
            <Link to="/teams" className="stat-link">
              View all →
            </Link>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/employees" className="action-btn">
              <span>➕</span>
              <span>Add Employee</span>
            </Link>
            <Link to="/teams" className="action-btn">
              <span>➕</span>
              <span>Create Team</span>
            </Link>
            <Link to="/logs" className="action-btn">
              <span>📋</span>
              <span>View Logs</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
