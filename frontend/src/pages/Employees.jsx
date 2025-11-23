import { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import EmployeeCard from '../components/EmployeeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentEmployee(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      position: '',
      department: ''
    });
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      department: employee.department || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentEmployee) {
        await employeeAPI.update(currentEmployee.id, formData);
      } else {
        await employeeAPI.create(formData);
      }
      
      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Employees</h1>
          <button onClick={handleCreate} className="btn btn-primary">
            + Add Employee
          </button>
        </div>

        <div className="cards-grid">
          {employees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleEdit}
            />
          ))}
        </div>

        {employees.length === 0 && (
          <div className="empty-state">
            <p>No employees yet. Create your first employee!</p>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{currentEmployee ? 'Edit Employee' : 'New Employee'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={e => setFormData({...formData, first_name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={e => setFormData({...formData, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={e => setFormData({...formData, position: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={e => setFormData({...formData, department: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {currentEmployee ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Employees;
