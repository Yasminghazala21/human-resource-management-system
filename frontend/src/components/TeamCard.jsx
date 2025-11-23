import './TeamCard.css';

const TeamCard = ({ team, onEdit, onDelete, onManageMembers }) => {
  return (
    <div className="team-card">
      <div className="card-header">
        <h3>{team.name}</h3>
        <span className="member-count">
          {team.employees?.length || 0} members
        </span>
      </div>
      
      <div className="card-body">
        {team.description && (
          <p className="description">{team.description}</p>
        )}
        
        {team.employees && team.employees.length > 0 && (
          <div className="members-list">
            <strong>Members:</strong>
            <ul>
              {team.employees.slice(0, 5).map(emp => (
                <li key={emp.id}>
                  {emp.first_name} {emp.last_name}
                </li>
              ))}
              {team.employees.length > 5 && (
                <li>+ {team.employees.length - 5} more</li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      <div className="card-actions">
        <button onClick={() => onManageMembers(team)} className="btn btn-sm btn-secondary">
          Manage Members
        </button>
        <button onClick={() => onEdit(team)} className="btn btn-sm btn-primary">
          Edit
        </button>
        <button onClick={() => onDelete(team.id)} className="btn btn-sm btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TeamCard;
