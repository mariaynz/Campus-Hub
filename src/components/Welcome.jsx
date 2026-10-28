import Button from './Button.jsx';
import Icon from './Icon.jsx';
import './Welcome.css';

export default function Welcome({ name, subtitle, onAdd }) {
  return (
    <section className="welcome">
      <div>
        <h1 className="welcome__title">Hola, {name}</h1>
        <p className="welcome__sub">{subtitle}</p>
      </div>
      <Button onClick={onAdd}>
        <Icon name="plus" size={18} />
        Agregar tarea
      </Button>
    </section>
  );
}
