import './FilterChips.css';

export default function FilterChips({ options, value, onChange, children }) {
  return (
    <div className="chips" role="group" aria-label="Filtrar por estado">
      {children}
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            className={'chip' + (active ? ' chip--active' : '')}
            aria-pressed={active}
            onClick={() => onChange(o.value)}
          >
            {o.label} <span className="chip__count">{o.count}</span>
          </button>
        );
      })}
    </div>
  );
}
