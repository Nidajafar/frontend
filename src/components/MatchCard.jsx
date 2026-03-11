import React from 'react';

export const MatchCard = ({ match }) => {
  // Status ke mutabiq color change karne ke liye
  const statusColor = match.status === 'Live' ? 'text-danger' : 'text-primary';

  return (
    <div className="card shadow-sm border-0 m-2" style={{ minWidth: '300px', borderRadius: '15px' }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted fw-bold">{match.matchType || 'T20 Match'}</small>
          {match.status === 'Live' && (
            <span className="badge rounded-pill bg-danger animate-pulse">● LIVE</span>
          )}
        </div>

        <div className="d-flex align-items-center justify-content-between my-3">
          <div className="text-center">
            <img src={match.teamALogo || 'https://via.placeholder.com/40'} alt="T1" width="40" className="mb-1" />
            <h6 className="mb-0">{match.teamA}</h6>
            <span className="fw-bold">{match.scoreA}</span>
          </div>

          <div className="fw-bold text-muted">vs</div>

          <div className="text-center">
            <img src={match.teamBLogo || 'https://via.placeholder.com/40'} alt="T2" width="40" className="mb-1" />
            <h6 className="mb-0">{match.teamB}</h6>
            <span className="fw-bold">{match.scoreB}</span>
          </div>
        </div>

        <hr className="my-2" />
        <p className={`small mb-0 fw-bold ${statusColor}`}>
          {match.status === 'Live' ? 'Match in Progress' : `Starts on: ${new Date(match.matchDate).toLocaleDateString()}`}
        </p>
      </div>
    </div>
  );
};

