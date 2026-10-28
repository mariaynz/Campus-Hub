import './Panel.css';

export default function Panel({ title, id, children }) {
  return (
    <section className="panel" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}
