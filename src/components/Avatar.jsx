// Foto de perfil, o las iniciales si no hay foto
export default function Avatar({ photo, initials, className = '' }) {
  return (
    <span className={`avatar-face ${className}`}>
      {photo ? <img src={photo} alt="" /> : initials}
    </span>
  );
}
