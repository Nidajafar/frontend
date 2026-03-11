import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageTeams = () => {
  // 1. States
  const [formData, setFormData] = useState({ name: '', captain: '', league: 'International', players: '', icon: '' });
  const [teamsList, setTeamsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. Fetch Function (Make sure your backend URL is correct)
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/teams');
      setTeamsList(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // 3. Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = { 
        ...formData, 
        players: formData.players.split(',').map(p => p.trim()).filter(p => p !== "") 
      };
      await axios.post('http://localhost:5000/api/teams/add', finalData);
      
      Swal.fire({
        icon: 'success',
        title: 'Team Saved!',
        background: '#064e3b',
        color: '#fff',
        confirmButtonColor: '#d4af37'
      });

      setFormData({ name: '', captain: '', league: 'International', players: '', icon: '' });
      fetchTeams(); // Refresh list
    } catch (error) {
      Swal.fire('Error', 'Failed to save team', error);
    }
  };

  return (
    <div className="animate__animated animate__fadeIn">
      <h3 className="fw-bold mb-4" style={{ color: '#064e3b' }}>🏏 Team Management</h3>
      
      {/* --- ADD TEAM FORM --- */}
      <form onSubmit={handleSubmit} className="row g-3 bg-white p-4 shadow-sm rounded-4 mb-5 border-top border-success border-4">
          <div className="col-md-6">
            <label className="small fw-bold">Team Name</label>
            <input type="text" className="form-control" placeholder="e.g. Pakistan" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} required/>
          </div>
          <div className="col-md-6">
            <label className="small fw-bold">Captain</label>
            <input type="text" className="form-control" placeholder="Captain Name" value={formData.captain} onChange={(e)=>setFormData({...formData, captain:e.target.value})} required/>
          </div>
          <div className="col-12">
            <label className="small fw-bold">Players (Comma Separated)</label>
            <textarea className="form-control" rows="3" placeholder="Babar, Rizwan, Shaheen..." value={formData.players} onChange={(e)=>setFormData({...formData, players:e.target.value})} />
          </div>
          <button type="submit" className="btn btn-success w-100 fw-bold rounded-pill py-2 shadow-sm">
            <i className="bi bi-cloud-arrow-up-fill me-2"></i> Save Team to Database
          </button>
      </form>

      {/* --- TEAMS LIST TABLE --- */}
      <div className="bg-white p-3 shadow-sm rounded-4">
        <h5 className="fw-bold mb-3">📋 Existing Teams</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Team</th>
                <th>Captain</th>
                <th>Squad</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-4">Loading teams...</td></tr>
              ) : teamsList.length > 0 ? (
                teamsList.map((team) => (
                  <tr key={team._id}>
                    <td><strong>{team.name}</strong></td>
                    <td>{team.captain}</td>
                    <td><span className="badge bg-info-subtle text-info px-3">{team.players.length} Players</span></td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger border-0"><i className="bi bi-trash3"></i></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-4 text-muted">No teams found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTeams;