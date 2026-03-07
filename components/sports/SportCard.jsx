import Link from 'next/link';

export default function SportCard({ sport }) {
  const { name, icon, description, href, color, comingSoon } = sport;

  const content = (
    <div className="sport-card" style={{ '--sport-accent': color }}>
      <div className="sport-card-icon">{icon}</div>
      <h3 className="sport-card-name">{name}</h3>
      <p className="sport-card-desc">{description}</p>
      {comingSoon && <span className="sport-card-badge">Coming Soon</span>}
    </div>
  );

  if (comingSoon) return content;

  return (
    <Link href={href} className="sport-card-link">
      {content}
    </Link>
  );
}
