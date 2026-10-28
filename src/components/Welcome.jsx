import Button from './Button.jsx';
import Icon from './Icon.jsx';
import './Welcome.css';

// Encabezado de página: título, subtítulo y botón de acción (opcional)
export default function Welcome({ title, subtitle, onAdd, actionLabel = 'Agregar tarea' }) {
  return (
    <section className="welcome">
      <div>
        <h1 className="welcome__title">{title}</h1>
        <p className="welcome__sub">{subtitle}</p>
      </div>
      {onAdd && (
        <Button onClick={onAdd}>
          <Icon name="plus" size={18} />
          {actionLabel}
        </Button>
      )}
    </section>
  );
}
