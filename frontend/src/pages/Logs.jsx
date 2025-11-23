import { useState, useEffect } from 'react';
import { logAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import './Logs.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await logAPI.getAll({ limit: 200 });
      setLogs(response.data.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionLabel = (action) => {
    const labels = {
      'user_logged_in': '🔐 User Login',
      'user_logged_out': '🔓 User Logout',
      'organisation_registered': '🏢 Organisation Created',
      'employee_created': '✅ Employee Created',
      'employee_updated': '✏️ Employee Updated',
      'employee_deleted': '🗑️ Employee Deleted',
      'team_created': '✅ Team Created',
      'team_updated': '✏️ Team Updated',
      'team_deleted': '🗑️ Team Deleted',
      'employee_assigned_to_team': '👥 Assignment',
      'employee_removed_from_team': '➖ Removal'
    };
    return labels[action] || action;
  };

  const filteredLogs = filter
    ? logs.filter(log => log.action.toLowerCase().includes(filter.toLowerCase()))
    : logs;

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Activity Logs</h1>
          <input
            type="text"
            placeholder="Filter by action..."
            className="filter-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="logs-container">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>User</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td>{formatDate(log.timestamp)}</td>
                  <td>
                    <span className="action-badge">
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td>{log.User?.name || 'System'}</td>
                  <td>
                    {log.meta && (
                      <pre className="log-meta">
                        {JSON.stringify(log.meta, null, 2)}
                      </pre>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="empty-state">
              <p>No logs found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Logs;
