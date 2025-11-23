import { useState, useEffect } from 'react';
import { teamAPI, employeeAPI } from '../services/api';
import TeamCard from '../components/TeamCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, employeesRes] = await Promise.all([
        teamAPI.getAll(),
        employeeAPI.getAll()
      ]);
      setTeams(teamsRes.data.data);
      setEmployees(employeesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentTeam(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (team) => {
    setCurrentTeam(team);
    setFormData({
      name: team.name,
      description: team.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team');
      }
    }
  };

  const handleManageMembers = (team) => {
    setCurrentTeam(team);
    const assignedIds = team.employees?.map(emp => emp.id) || [];
    setSelectedEmployees(assignedIds);
    setShowAssignModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentTeam) {
        await teamAPI.update(currentTeam.id, formData);
      } else {
        await teamAPI.create(formData);
      }
      
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team');
    }
  };

  const handleAssignSubmit = async () => {
    try {
      await teamAPI.assignEmployees(currentTeam.id, selectedEmployees);
      setShowAssignModal(false);
      fetchData();
    } catch (error) {
      console.error('Error assigning employees:', error);
      alert('Failed to assign employees');
    }
  };

  const toggleEmployee = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Teams</h1>
          <button onClick={handleCreate} className="btn btn-primary">
            + Create Team
          </button>
        </div>

        <div className="cards-grid">
          {teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onManageMembers={handleManageMembers}
            />
          ))}
        </div>

        {teams.length === 0 && (
          <div className="empty-state">
            <p>No teams yet. Create your first team!</p>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{currentTeam ? 'Edit Team' : 'New Team'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Team Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows="4"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {currentTeam ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAssignModal && (
          <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Manage Team Members</h2>
              <p>Select employees to assign to {currentTeam?.name}</p>
              
              <div className="employee-selection">
                {employees.map(employee => (
                  <label key={employee.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => toggleEmployee(employee.id)}
                    />
                    <span>
                      {employee.first_name} {employee.last_name}
                      {employee.position && ` - ${employee.position}`}
                    </span>
                  </label>
                ))}
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowAssignModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleAssignSubmit} className="btn btn-primary">
                  Save Assignments
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Teams;
