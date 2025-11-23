import './EmployeeCard.css';

const EmployeeCard = ({ employee, onEdit, onDelete, onView }) => {
  return (
    <div className="employee-card">
      <div className="card-header">
        <h3>{employee.first_name} {employee.last_name}</h3>
        {employee.position && <span className="position">{employee.position}</span>}
      </div>
      
      <div className="card-body">
        {employee.email && (
          <p><strong>Email:</strong> {employee.email}</p>
        )}
        {employee.phone && (
          <p><strong>Phone:</strong> {employee.phone}</p>
        )}
        {employee.department && (
          <p><strong>Department:</strong> {employee.department}</p>
        )}
        
        {employee.teams && employee.teams.length > 0 && (
          <div className="teams-list">
            <strong>Teams:</strong>
            {employee.teams.map(team => (
              <span key={team.id} className="team-badge">{team.name}</span>
            ))}
          </div>
        )}
      </div>
      
      <div className="card-actions">
        <button onClick={() => onView(employee)} className="btn btn-sm btn-secondary">
          View
        </button>
        <button onClick={() => onEdit(employee)} className="btn btn-sm btn-primary">
          Edit
        </button>
        <button onClick={() => onDelete(employee.id)} className="btn btn-sm btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
