import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CricketTeams = () => {
  const [teams, setTeams] = useState([]);
  const [activeCategory, setActiveCategory] = useState('International');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['International', 'PSL', 'IPL'];

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('https://cricket-project-tau.vercel.app/api/teams');

      // API response check
      if (Array.isArray(res.data)) {
        setTeams(res.data);
      } else if (res.data && Array.isArray(res.data.teams)) {
        setTeams(res.data.teams);
      } else {
        setTeams([]);
        console.warn("Unexpected teams data:", res.data);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError("Teams load nahi ho sakay! Please try again later.");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = Array.isArray(teams)
    ? teams.filter(team => team.league === activeCategory)
    : [];

  return (
    <div className="container mt-4 p-4 min-vh-100" style={{ backgroundColor: '#f0fdf4' }}>
      {/* --- Page Header --- */}
      <div className="text-center mb-5">
        <h2 className="fw-bold display-5" style={{ color: '#064e3b' }}>🏏 Cricket Squads</h2>
        <p className="text-muted">Select a league to view teams, captains, and full player lists.</p>
      </div>

      {/* --- League Filter Buttons --- */}
      <div className="d-flex gap-3 mb-5 justify-content-center">
        {categories.map((cat) => (
          <button 
            key={cat}
            className={`btn rounded-pill px-4 fw-bold shadow-sm transition-all`}
            style={{
              backgroundColor: activeCategory === cat ? '#064e3b' : '#ffffff',
              color: activeCategory === cat ? '#d4af37' : '#064e3b',
              border: `2px solid #064e3b`,
              transition: '0.3s'
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- Team Cards --- */}
      <div className="row g-4">
        {loading ? (
          <div className="text-center w-100 py-5">
            <div className="spinner-border" role="status" style={{ color: '#d4af37' }}></div>
          </div>
        ) : error ? (
          <div className="text-center w-100 py-5 text-danger">{error}</div>
        ) : filteredTeams.length > 0 ? (
          filteredTeams.map((team, index) => (
            <div className="col-md-6 col-lg-4" key={team._id || index}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden team-card">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 className="fw-bold mb-0" style={{ color: '#064e3b' }}>
                        {team.icon} {team.name}
                      </h3>
                      <span className="badge" style={{
                        backgroundColor: '#064e3b',
                        color: '#d4af37',
                        fontSize: '0.75rem'
                      }}>
                        {team.league}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <small className="d-block fw-bold text-muted">CAPTAIN</small>
                    <h5 className="fw-bold" style={{ color: '#d4af37' }}>⭐ {team.captain}</h5>
                  </div>

                  <hr className="my-3 opacity-25" />

                  <h6 className="fw-bold small mb-2" style={{ color: '#064e3b' }}>FULL SQUAD:</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {Array.isArray(team.players) && team.players.length > 0 ? (
                      team.players.map((player, idx) => (
                        <span key={idx} className="badge" style={{
                          backgroundColor: '#f0fdf4',
                          color: '#064e3b',
                          border: '1px solid #064e3b',
                          fontSize: '0.75rem'
                        }}>
                          {player}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted small">No players added</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 w-100 text-muted">
            <i className="bi bi-emoji-smile fs-1" style={{ color: '#064e3b' }}></i>
            <p className="mt-2">No teams added for {activeCategory} yet.</p>
          </div>
        )}
      </div>

      {/* --- Safe CSS without jsx warning --- */}
      <style>{`
        .team-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          border-top: 4px solid #d4af37;
        }
        .team-card:hover {
          transform: scale(1.03);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default CricketTeams;