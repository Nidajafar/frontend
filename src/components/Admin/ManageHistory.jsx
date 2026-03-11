import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageHistory = () => {
  // 1. World Cup History State
  const [formData, setFormData] = useState({ 
    year: '', 
    winner: '', 
    runnerUp: '', 
    host: '', 
    tournament: 'T20 World Cup' 
  });
  
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. Fetch Records from Backend
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/history');
      setHistoryList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchRecords(); 
  }, []);

  // 3. Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/history/add', formData);
      Swal.fire({
        icon: 'success',
        title: 'History Saved',
        text: `${formData.tournament} ${formData.year} record added!`,
        confirmButtonColor: '#064e3b'
      });
      // Reset Form
      setFormData({ year: '', winner: '', runnerUp: '', host: '', tournament: 'T20 World Cup' });
      fetchRecords();
    } catch (err) {
      console.error("Error saving history:", err);
      Swal.fire('Error', 'Could not save history. Check Backend!', 'error');
    }
  };

  // 4. Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/history/${id}`);
        fetchRecords();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate__animated animate__fadeIn">
      <h3 className="fw-bold mb-4" style={{ color: '#064e3b' }}>📜 Tournament History Management</h3>
      
      {/* --- ADD HISTORY FORM --- */}
      <form onSubmit={handleSubmit} className="row g-3 bg-white p-4 shadow-sm rounded-4 mb-5 border-top border-primary border-4">
          <div className="col-md-4">
            <label className="small fw-bold">Tournament Type</label>
            <select className="form-select" value={formData.tournament} onChange={(e)=>setFormData({...formData, tournament:e.target.value})}>
                <option>T20 World Cup</option>
                <option>ICC World Cup</option>
                <option>Asia Cup</option>
                <option>Champions Trophy</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="small fw-bold">Year</label>
            <input type="number" className="form-control" placeholder="e.g. 2024" value={formData.year} onChange={(e)=>setFormData({...formData, year:e.target.value})} required />
          </div>
          <div className="col-md-4">
            <label className="small fw-bold">Host Country</label>
            <input type="text" className="form-control" placeholder="e.g. West Indies" value={formData.host} onChange={(e)=>setFormData({...formData, host:e.target.value})} required />
          </div>
          <div className="col-md-6">
            <label className="small fw-bold">Winner</label>
            <input type="text" className="form-control" placeholder="Winning Team" value={formData.winner} onChange={(e)=>setFormData({...formData, winner:e.target.value})} required />
          </div>
          <div className="col-md-6">
            <label className="small fw-bold">Runner Up</label>
            <input type="text" className="form-control" placeholder="Finalist Team" value={formData.runnerUp} onChange={(e)=>setFormData({...formData, runnerUp:e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold rounded-pill mt-3 shadow-sm">
            <i className="bi bi-save2-fill me-2"></i> Save History Record
          </button>
      </form>

      {/* --- HISTORY LIST TABLE --- */}
      <div className="bg-white p-3 shadow-sm rounded-4">
        <h5 className="fw-bold mb-3">📋 Recorded History</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Tournament</th>
                <th>Year</th>
                <th>Winner</th>
                <th>Runner Up</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading history...</td></tr>
              ) : historyList.length > 0 ? (
                historyList.map((item) => (
                  <tr key={item._id}>
                    <td><span className="badge bg-primary-subtle text-primary">{item.tournament}</span></td>
                    <td className="fw-bold">{item.year}</td>
                    <td className="text-success fw-bold">🏆 {item.winner}</td>
                    <td>{item.runnerUp}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(item._id)}>
                        <i className="bi bi-trash3 fs-5"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No history records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageHistory;