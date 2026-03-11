import React, { useState, useEffect, useCallback } from 'react'; // 'i' small kar diya
import axios from 'axios';
import Swal from 'sweetalert2';
import UpdateScore from './updateScore';

const ManageMatches = () => {
  const [matches, setMatches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [matchData, setMatchData] = useState({
    teamA: '', teamB: '', teamA_Logo: '', teamB_Logo: '',
    matchDate: '', venue: '', videoUrl: '', status: 'Upcoming'
  });

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/matches');
      setMatches(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchMatches(); 
  }, [fetchMatches]);

  // 🎙️ Live Commentary Handler
  const addCommentary = async (matchId) => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Live Commentary',
      html:
        '<input id="over" class="swal2-input" placeholder="Over (e.g. 15.2)">' +
        '<input id="text" class="swal2-input" placeholder="Commentary text">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Post Update',
      preConfirm: () => ({
        over: document.getElementById('over').value,
        text: document.getElementById('text').value
      })
    });

    if (formValues?.over && formValues?.text) {
      try {
        await axios.post(`http://localhost:5000/api/matches/commentary/${matchId}`, formValues);
        Swal.fire('Updated!', 'Commentary posted.', 'success');
        fetchMatches();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to post', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/matches/${editId}`, matchData);
        Swal.fire('Updated!', 'Match saved.', 'success');
      } else {
        await axios.post('http://localhost:5000/api/matches/add', matchData);
        Swal.fire('Added!', 'New match posted.', 'success');
      }
      setMatchData({ teamA: '', teamB: '', teamA_Logo: '', teamB_Logo: '', matchDate: '', venue: '', videoUrl: '', status: 'Upcoming' });
      setIsEditing(false); 
      setEditId(null); 
      fetchMatches();
    } catch (err) { 
      console.error(err); 
      Swal.fire('Error', 'Action failed', 'error'); 
    }
  };

  return (
    <div className="container-fluid p-4">
      <h3 className="fw-bold mb-4">🏟️ Tournament Admin</h3>
      
      <form onSubmit={handleSubmit} className="row g-3 bg-white p-4 shadow-sm rounded-4 mb-5 border-top border-success border-4">
        <div className="col-md-6"><label className="fw-bold small">Team A</label><input type="text" className="form-control" value={matchData.teamA} onChange={(e)=>setMatchData({...matchData, teamA:e.target.value})} required /></div>
        <div className="col-md-6"><label className="fw-bold small">Team B</label><input type="text" className="form-control" value={matchData.teamB} onChange={(e)=>setMatchData({...matchData, teamB:e.target.value})} required /></div>
        <div className="col-md-8"><label className="fw-bold small">Live/Highlights URL</label><input type="text" className="form-control" value={matchData.videoUrl} onChange={(e)=>setMatchData({...matchData, videoUrl:e.target.value})} /></div>
        <div className="col-md-4"><label className="fw-bold small">Status</label>
          <select className="form-select" value={matchData.status} onChange={(e)=>setMatchData({...matchData, status:e.target.value})}>
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Finished">Finished</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success w-100 rounded-pill mt-3">{isEditing ? 'Update Match' : 'Post Match'}</button>
      </form>

      <div className="table-responsive bg-white p-3 shadow-sm rounded-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-2">Loading Matches...</p>
          </div>
        ) : (
          <table className="table table-hover align-middle">
            <thead><tr><th>Match</th><th>Status</th><th className="text-center">Manage</th></tr></thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m._id}>
                  <td><strong>{m.teamA} vs {m.teamB}</strong></td>
                  <td><span className={`badge ${m.status === 'Live' ? 'bg-danger' : 'bg-secondary'}`}>{m.status}</span></td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-warning me-2 border-0" onClick={() => addCommentary(m._id)} title="Add Commentary">
                      <i className="bi bi-mic-fill fs-5"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-success me-2 border-0" onClick={() => { setSelectedMatch(m); setShowScoreModal(true); }}><i className="bi bi-scoreboard-fill fs-5"></i></button>
                    <button className="btn btn-sm btn-outline-primary me-2 border-0" onClick={() => { setMatchData(m); setIsEditing(true); setEditId(m._id); }}><i className="bi bi-pencil-square fs-5"></i></button>
                    <button className="btn btn-sm btn-outline-danger border-0" onClick={() => { 
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "Match delete ho jayega!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          axios.delete(`http://localhost:5000/api/matches/${m._id}`).then(() => fetchMatches());
                        }
                      })
                    }}><i className="bi bi-trash3 fs-5"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showScoreModal && selectedMatch && (
        <div className="modal-backdrop show d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050, background: 'rgba(0,0,0,0.8)' }}>
          <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '90%', maxWidth: '500px' }}>
            <div className="text-end"><button className="btn-close" onClick={() => setShowScoreModal(false)}></button></div>
            <UpdateScore matchId={selectedMatch._id} teamA={selectedMatch.teamA} teamB={selectedMatch.teamB} />
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageMatches;