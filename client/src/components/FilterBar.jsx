const FilterBar = ({ current, onChange, counts }) => {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'done', label: 'Done' }
  ];

  return (
    <div className="filter-bar">
      {filters.map(f => (
        <button
          key={f.key}
          className={`filter-btn ${current === f.key ? 'active' : ''}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
          {counts[f.key] !== undefined && <span className="filter-count">{counts[f.key]}</span>}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
