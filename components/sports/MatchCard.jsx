import Link from 'next/link';

const STATUS_MAP = {
  'TBD': 'TBD',
  'NS': 'NS',
  '1H': 'LIVE',
  '2H': 'LIVE',
  'HT': 'HT',
  'ET': 'LIVE',
  'BT': 'LIVE',
  'P': 'PEN',
  'SUSP': 'SUSP',
  'INT': 'INT',
  'FT': 'FT',
  'AET': 'FT',
  'PEN': 'FT',
  'PST': 'PST',
  'CANC': 'CANC',
  'ABD': 'ABD',
  'AWD': 'AWD',
  'WO': 'WO',
  'LIVE': 'LIVE',
};

function getStatusBadge(short) {
  const label = STATUS_MAP[short] || short;
  const isLive = ['LIVE', '1H', '2H', 'ET', 'BT'].includes(short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(short);

  let className = 'match-status';
  if (isLive) className += ' match-status--live';
  else if (isFinished) className += ' match-status--ft';
  else className += ' match-status--ns';

  return <span className={className}>{label}</span>;
}

function formatKickoff(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MatchCard({ fixture }) {
  const { teams, goals, fixture: meta } = fixture;
  const short = meta.status.short;
  const isStarted = !['TBD', 'NS', 'PST', 'CANC'].includes(short);

  return (
    <div className="match-card">
      <div className="match-card-header">
        {getStatusBadge(short)}
        {!isStarted && (
          <span className="match-kickoff">{formatKickoff(meta.date)}</span>
        )}
      </div>
      <div className="match-card-teams">
        <div className="match-team">
          <img
            src={teams.home.logo}
            alt={teams.home.name}
            className="match-team-logo"
            width={28}
            height={28}
          />
          <span className="match-team-name">{teams.home.name}</span>
          {isStarted && (
            <span className="match-score">{goals.home ?? '-'}</span>
          )}
        </div>
        <div className="match-team">
          <img
            src={teams.away.logo}
            alt={teams.away.name}
            className="match-team-logo"
            width={28}
            height={28}
          />
          <span className="match-team-name">{teams.away.name}</span>
          {isStarted && (
            <span className="match-score">{goals.away ?? '-'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
