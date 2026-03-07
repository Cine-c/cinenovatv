export default function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) {
    return <p className="standings-empty">No standings data available.</p>;
  }

  return (
    <div className="standings-wrapper">
      <table className="standings-table">
        <thead>
          <tr>
            <th className="standings-rank">#</th>
            <th className="standings-team">Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th className="standings-hide-mobile">GF</th>
            <th className="standings-hide-mobile">GA</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => {
            let zoneClass = '';
            if (row.rank <= 4) zoneClass = 'standings-zone--ucl';
            else if (row.rank === 5) zoneClass = 'standings-zone--uel';
            else if (row.rank >= standings.length - 2)
              zoneClass = 'standings-zone--rel';

            return (
              <tr key={row.team.id} className={zoneClass}>
                <td className="standings-rank">{row.rank}</td>
                <td className="standings-team">
                  <img
                    src={row.team.logo}
                    alt={row.team.name}
                    className="standings-team-logo"
                    width={20}
                    height={20}
                  />
                  <span>{row.team.name}</span>
                </td>
                <td>{row.all.played}</td>
                <td>{row.all.win}</td>
                <td>{row.all.draw}</td>
                <td>{row.all.lose}</td>
                <td className="standings-hide-mobile">{row.all.goals.for}</td>
                <td className="standings-hide-mobile">{row.all.goals.against}</td>
                <td>{row.goalsDiff}</td>
                <td className="standings-pts">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
