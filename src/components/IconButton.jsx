import Icon from './Icon.jsx';
import './IconButton.css';

// Botón de solo ícono (eliminar o cambiar fecha). `label` es obligatorio: es el texto para lectores de pantalla.
export default function IconButton({ icon, label, onClick, tone = 'danger', className = '' }) {
  return (
    <button type="button" className={`icon-btn icon-btn--${tone} ${className}`.trim()} onClick={onClick} aria-label={label} title={label}>
      <Icon name={icon} size={18} />
    </button>
  );
}
