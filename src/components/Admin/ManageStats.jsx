import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageStats = () => {
  const [playerData, setPlayerData] = useState({
    name: '', role: 'Batsman', matches: 0, runs: 0, wickets: 0, strikeRate: ''
  });
  const [photo, setPhoto] = useState(null);
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 1. Red Line Fix: useEffect ke andar function define kiya
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/players');
        setPlayers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchPlayers();
  }, []);

  // Helper function list ko refresh karne ke liye (Submit/Delete ke baad)
  const refreshList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/players');
      setPlayers(res.data);
    } catch (err) { console.log(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(playerData).forEach(key => data.append(key, playerData[key]));
    if (photo) data.append('photo', photo);

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/players/${editId}`, data);
        Swal.fire('Updated!', 'Player stats updated successfully.', 'success');
      } else {
        await axios.post('http://localhost:5000/api/players/add', data);
        Swal.fire('Saved!', 'New player added to stats.', 'success');
      }
      
      // Reset State
      setPlayerData({ name: '', role: 'Batsman', matches: 0, runs: 0, wickets: 0, strikeRate: '' });
      setPhoto(null);
      setIsEditing(false);
      setEditId(null);
      refreshList();
    } catch (err) {
      console.error("Submit Error:", err);
      Swal.fire('Error', 'Action failed! Check backend connectivity.', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this record!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // DELETE logic as confirmed in your previous screenshot
          await axios.delete(`http://localhost:5000/api/players/${id}`);
          Swal.fire('Deleted!', 'Player record removed.', 'success');
          refreshList();
        } catch (err) {
          console.error(err);
          Swal.fire('Error', 'Record delete nahi ho saka.', 'error');
        }
      }
    });
  };

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate__animated animate__fadeIn p-2">
      <h3 className="fw-bold mb-4" style={{ color: '#064e3b' }}>📊 Career Statistics Hub</h3>
      
      {/* --- STATS FORM --- */}
      <form onSubmit={handleSubmit} className="row g-3 bg-white p-4 shadow-sm rounded-4 mb-5 border-top border-warning border-4">
        <div className="col-md-4">
          <label className="small fw-bold">Player Name</label>
          <input type="text" className="form-control" value={playerData.name} onChange={(e)=>setPlayerData({...playerData, name:e.target.value})} required />
        </div>
        <div className="col-md-4">
          <label className="small fw-bold">Role</label>
          <select className="form-select" value={playerData.role} onChange={(e)=>setPlayerData({...playerData, role:e.target.value})}>
            <option>Batsman</option><option>Bowler</option><option>All-Rounder</option><option>Wicket Keeper</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="small fw-bold">Profile Picture</label>
          <input type="file" className="form-control" onChange={(e)=>setPhoto(e.target.files[0])} accept="image/*" />
        </div>
        <div className="col-md-3"><label className="small fw-bold">Matches</label><input type="number" className="form-control" value={playerData.matches} onChange={(e)=>setPlayerData({...playerData, matches:e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold">Runs</label><input type="number" className="form-control" value={playerData.runs} onChange={(e)=>setPlayerData({...playerData, runs:e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold">Wickets</label><input type="number" className="form-control" value={playerData.wickets} onChange={(e)=>setPlayerData({...playerData, wickets:e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold">S/R</label><input type="text" className="form-control" value={playerData.strikeRate} onChange={(e)=>setPlayerData({...playerData, strikeRate:e.target.value})} /></div>
        
        <div className="col-12 d-flex gap-2">
            <button type="submit" className={`btn ${isEditing ? 'btn-primary' : 'btn-warning'} w-100 rounded-pill fw-bold mt-2 shadow-sm`}>
                {isEditing ? 'Update Stats Record' : 'Save Career Stats'}
            </button>
            {isEditing && (
                <button type="button" className="btn btn-light rounded-pill mt-2" onClick={() => { setIsEditing(false); setPlayerData({name:'', role:'Batsman', matches:0, runs:0, wickets:0, strikeRate:''}) }}>Cancel</button>
            )}
        </div>
      </form>

      {/* --- SEARCH & LIST --- */}
      <div className="bg-white p-4 rounded-4 shadow-sm border">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h5 className="fw-bold text-muted mb-0">📋 Registered Players</h5>
          <div className="position-relative w-100" style={{maxWidth: '300px'}}>
            <input type="text" className="form-control rounded-pill ps-5" placeholder="Search by name..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr><th>Profile</th><th>Player</th><th>Runs</th><th>Wkts</th><th className="text-center">Action</th></tr>
            </thead>
            <tbody>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.photo || 'https://via.placeholder.com/40'} width="45" height="45" className="rounded-circle border object-fit-cover" alt="img" /></td>
                    <td><strong>{p.name}</strong><br/><small className="text-muted">{p.role}</small></td>
                    <td className="text-success fw-bold">{p.runs}</td>
                    <td className="text-danger fw-bold">{p.wickets}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary border-0 me-1" onClick={() => { setPlayerData(p); setEditId(p._id); setIsEditing(true); window.scrollTo(0,0); }}>
                        <i className="bi bi-pencil-square fs-5"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(p._id)}>
                        <i className="bi bi-trash3 fs-5"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-4 text-muted">Abhi koi player data maujood nahi hai. 🏏</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStats;