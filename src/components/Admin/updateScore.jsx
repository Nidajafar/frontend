import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateScore = ({ matchId, teamA, teamB }) => {
  const [stats, setStats] = useState({
    teamA_Score: { runs: 0, wickets: 0, overs: 0 },
    teamB_Score: { runs: 0, wickets: 0, overs: 0 },
    currentInnings: 'Team A'
  });

  // 1. Existing Stats Fetch Karein
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stats/${matchId}`);
        if (res.data) setStats(res.data);
      } catch (err) {
        console.error(err);
        console.log("No existing stats found, starting fresh.");
      }
    };
    fetchStats();
  }, [matchId]);

  // 2. Score Update Function
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/stats/update/${matchId}`, stats);
      Swal.fire('Updated!', 'Live score has been updated.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Could not update score.', 'error');
    }
  };

  return (
    <div className="bg-light p-4 rounded-4 shadow-sm border mt-3">
      <h5 className="fw-bold text-success mb-3">🔴 Live Score Updater</h5>
      
      <div className="row g-3">
        {/* Team A Stats */}
        <div className="col-md-6 border-end">
          <h6 className="fw-bold">{teamA} (Team A)</h6>
          <label className="small">Runs / Wickets</label>
          <div className="d-flex gap-2 mb-2">
            <input type="number" className="form-control" value={stats.teamA_Score.runs} 
              onChange={(e) => setStats({...stats, teamA_Score: {...stats.teamA_Score, runs: e.target.value}})} />
            <input type="number" className="form-control" value={stats.teamA_Score.wickets} 
              onChange={(e) => setStats({...stats, teamA_Score: {...stats.teamA_Score, wickets: e.target.value}})} />
          </div>
          <label className="small">Overs</label>
          <input type="number" className="form-control" value={stats.teamA_Score.overs} 
            onChange={(e) => setStats({...stats, teamA_Score: {...stats.teamA_Score, overs: e.target.value}})} />
        </div>

        {/* Team B Stats */}
        <div className="col-md-6">
          <h6 className="fw-bold">{teamB} (Team B)</h6>
          <label className="small">Runs / Wickets</label>
          <div className="d-flex gap-2 mb-2">
            <input type="number" className="form-control" value={stats.teamB_Score.runs} 
              onChange={(e) => setStats({...stats, teamB_Score: {...stats.teamB_Score, runs: e.target.value}})} />
            <input type="number" className="form-control" value={stats.teamB_Score.wickets} 
              onChange={(e) => setStats({...stats, teamB_Score: {...stats.teamB_Score, wickets: e.target.value}})} />
          </div>
          <label className="small">Overs</label>
          <input type="number" className="form-control" value={stats.teamB_Score.overs} 
            onChange={(e) => setStats({...stats, teamB_Score: {...stats.teamB_Score, overs: e.target.value}})} />
        </div>
      </div>

      <button onClick={handleUpdate} className="btn btn-dark w-100 mt-4 rounded-pill fw-bold">
        Save Live Score
      </button>
    </div>
  );
};

export default UpdateScore;