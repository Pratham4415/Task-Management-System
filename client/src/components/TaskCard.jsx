const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusClass = {
    'pending': 'status-pending',
    'in-progress': 'status-progress',
    'done': 'status-done'
  };

  const statusLabel = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'done': 'Done'
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-card-header">
        <span className={`status-badge ${statusClass[task.status]}`}>
          {statusLabel[task.status]}
        </span>
        <div className="task-actions">
          <button className="icon-btn" onClick={() => onEdit(task)} title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="icon-btn delete" onClick={() => onDelete(task)} title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-meta">
        <span className={`task-date ${isOverdue ? 'overdue-text' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
