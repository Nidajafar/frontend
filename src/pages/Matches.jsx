import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState({});

  // 1. fetchScore ko useCallback mein rakha taake "dependency" error na aaye
  const fetchScore = useCallback(async (matchId) => {
    try {
      const res = await axios.get(`cricket-project-tau.vercel.app/api/stats/${matchId}`);
      if (res.data) {
        setScores(prev => ({ ...prev, [matchId]: res.data }));
      }
    } catch (err) {
      console.error(`Error fetching score for match ${matchId}:`, err);
      console.log(`No score yet for match: ${matchId}`);
    }
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('cricket-project-tau.vercel.app/api/matches');
        const matchesData = Array.isArray(res.data) ? res.data : [];
        setMatches(matchesData);

        // Har match ka score load karein
        matchesData.forEach(match => {
          fetchScore(match._id);
        });
      } catch (err) {
        console.error("Error fetching matches", err);
      }
    };
    fetchMatches();
  }, [fetchScore]); // fetchScore yahan add karna zaroori hai

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      <h2 className="text-center fw-bold mb-5" style={{ color: '#064e3b' }}>🏆 LIVE TOURNAMENT FIXTURES</h2>
      <div className="row g-4">
        {matches.map((m) => (
          <div className="col-lg-4 col-md-6" key={m?._id}>
            <div className="card shadow border-0 rounded-4 overflow-hidden h-100">
              
              <div className="bg-dark" style={{ height: '180px' }}>
                {m?.videoUrl ? (
                  <ReactPlayer url={m.videoUrl} width="100%" height="100%" light={true} />
                ) : (
                  <div className="text-white d-flex align-items-center justify-content-center h-100 small">
                    Highlights Coming Soon
                  </div>
                )}
              </div>

              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Team A Section */}
                  <div className="text-center" style={{ width: '40%' }}>
                    <img src={m?.teamA_Logo || 'https://via.placeholder.com/50'} alt="logo" width="45" className="mb-2 shadow-sm rounded-circle" />
                    <h6 className="fw-bold mb-0">{m?.teamA}</h6>
                    {scores[m?._id] && (
                      <div className="mt-1">
                        <span className="badge bg-success shadow-sm">
                          {scores[m._id].teamA_Score.runs}/{scores[m._id].teamA_Score.wickets}
                        </span>
                        <div className="text-muted" style={{ fontSize: '10px' }}>
                          ({scores[m._id].teamA_Score.overs} ov) {/* Overs added here */}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="badge bg-danger rounded-circle p-2 shadow-sm" style={{ zIndex: 1 }}>VS</div>

                  {/* Team B Section */}
                  <div className="text-center" style={{ width: '40%' }}>
                    <img src={m?.teamB_Logo || 'https://via.placeholder.com/50'} alt="logo" width="45" className="mb-2 shadow-sm rounded-circle" />
                    <h6 className="fw-bold mb-0">{m?.teamB}</h6>
                    {scores[m?._id] && (
                      <div className="mt-1">
                        <span className="badge bg-success shadow-sm">
                          {scores[m._id].teamB_Score.runs}/{scores[m._id].teamB_Score.wickets}
                        </span>
                        <div className="text-muted" style={{ fontSize: '10px' }}>
                          ({scores[m._id].teamB_Score.overs} ov) {/* Overs added here */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="text-muted opacity-25" />

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="small text-muted"><i className="bi bi-geo-alt-fill me-1 text-danger"></i>{m?.venue}</span>
                  <span className={`badge px-3 py-2 rounded-pill ${m?.status === 'Live' ? 'bg-danger animate__animated animate__flash animate__infinite' : 'bg-dark'}`}>
                    {m?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;