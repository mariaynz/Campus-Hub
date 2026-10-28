import './StatCard.css';

export default function StatCard({ label, value, detail, urgent = false, featured = false }) {
  const cls = 'stat' + (featured ? ' stat--featured' : ' stat--compact') + (urgent ? ' stat--urgent' : '');
  return (
    <article className={cls}>
      <p className="stat__label">{label}</p>
      <p className="stat__value">{value}</p>
      <p className="stat__detail">{detail}</p>
    </article>
  );
}
