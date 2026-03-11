import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MatchCard } from '../components/MatchCard';
import { Highlights } from '../components/Highlight';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend se Matches ka data mangwane ke liye
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await axios.get('https://cricket-project-tau.vercel.app/api/matches');

        // Check karo ke data array hai ya nahi
        if (Array.isArray(data)) {
          setMatches(data);
        } else if (data && Array.isArray(data.matches)) {
          setMatches(data.matches); // Agar API { matches: [...] } return kar rahi hai
        } else {
          setMatches([]);
          console.warn("Unexpected matches data:", data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Matches load nahi ho sakay!", err);
        setError("Matches load nahi ho sakay!"); // Error message
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="p-4 bg-light min-vh-100" style={{ overflowX: 'hidden' }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Welcome to NJ CRICKET 🏟️</h3>
        <span className="text-muted small">{new Date().toDateString()}</span>
      </div>

      {/* 1. Recent & Live Matches (Horizontal Scroll) */}
      <h5 className="text-secondary mb-3 fw-bold">Recent & Live Matches</h5>
      <div 
        className="d-flex overflow-auto pb-3 mb-4 no-scrollbar" 
        style={{ gap: '15px', scrollbarWidth: 'none' }}
      >
        {loading ? (
          <div className="text-muted p-3">Matches load ho rahe hain...</div>
        ) : error ? (
          <div className="alert alert-danger w-100">{error}</div>
        ) : matches.length > 0 ? (
          matches.map((m) => <MatchCard key={m._id || m.id} match={m} />)
        ) : (
          <div className="alert alert-light border w-100">
            There is no live match scheduled right now.
          </div>
        )}
      </div>

      {/* 2. Highlights Section (Videos Thumbnails) */}
      <Highlights />

      {/* 3. Hero Banner */}
      <div 
        className="mt-5 p-5 bg-success text-white rounded-4 shadow-lg position-relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(45deg, #198754, #146c43)',
          border: 'none' 
        }}
      >
        <div className="position-relative" style={{ zIndex: 2 }}>
          <h2 className="fw-bold display-5">ICC Champions Trophy 2025</h2>
          <p className="lead">Catch all the action live, exclusive, and ball-by-ball on our dashboard.</p>
          <button className="btn btn-warning fw-bold px-4 py-2 mt-2 shadow-sm">
            <i className="bi bi-calendar-event me-2"></i>View Full Schedule
          </button>
        </div>
        
        {/* Decorative background circle */}
        <img  
          className="position-absolute rounded-circle bg-white opacity-10" 
          style={{ width: '300px', height: '300px', right: '-50px', top: '-50px' }} 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW7c3_B6q3O4LcLb2WfoPQT_dSPTWqddak0Q&s" 
          alt="" 
        />
      </div>

      {/* Footer Info */}
      <p className="text-center text-muted mt-5 small">© 2025 Cric-Pro Dashboard | Powered by Nida Jafar</p>
    </div>
  );
};

export default Dashboard;