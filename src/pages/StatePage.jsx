import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatsPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultUserIcon = 'https://cdn-icons-png.flaticon.com/512/21/21104.png';

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Double check URL: Kya backend 5000 port par hi chal raha hai?
        const res = await axios.get('cricket-project-tau.vercel.app/api/players');
        setPlayers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("404 Error: Backend par route nahi mila!", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  return (
    <div className="p-4 min-vh-100" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#064e3b' }}>📊 Player Career Statistics</h2>
        <button className="btn btn-outline-success btn-sm rounded-pill fw-bold" onClick={() => window.location.reload()}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: '#064e3b', color: '#d4af37' }}>
              <tr>
                <th className="ps-4">PLAYER</th>
                <th>ROLE</th>
                <th>MATCHES</th>
                <th>RUNS</th>
                <th>WICKETS</th>
                <th className="pe-4">S/R</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-success"></div></td></tr>
              ) : players.length > 0 ? (
                players.map((p) => (
                  <tr key={p._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <img src={p.photo || p.image || defaultUserIcon} alt="player" className="rounded-circle me-3 border shadow-sm" width="40" height="40" />
                        <span className="fw-bold" style={{ color: '#064e3b' }}>{p.name}</span>
                      </div>
                    </td>
                    <td><span className="badge bg-success">{p.role || 'Player'}</span></td>
                    <td>{p.matches || 0}</td>
                    <td className="fw-bold text-success">{p.runs || 0}</td>
                    <td className="fw-bold text-danger">{p.wickets || 0}</td>
                    <td className="pe-4 text-muted">{p.strikeRate || '0.0'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-5 text-muted">Abhi koi player data maujood nahi hai. 🏏</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;