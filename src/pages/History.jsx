import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [historyList, setHistoryList] = useState([]);
  const [activeTab, setActiveTab] = useState('T20 World Cup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tournaments = ['T20 World Cup', 'ICC World Cup', 'Champions Trophy', 'Asia Cup'];

  const fetchAllHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://cricket-project-tau.vercel.app/api/history');

      // API response check
      if (Array.isArray(response.data)) {
        setHistoryList(response.data);
      } else if (response.data && Array.isArray(response.data.history)) {
        setHistoryList(response.data.history);
      } else {
        setHistoryList([]);
        console.warn("Unexpected history data:", response.data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Unable to load history data. Please try again later.");
      setHistoryList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHistory();
  }, []);

  // Safe filter
  const filteredData = Array.isArray(historyList)
    ? historyList.filter(item => item.tournament === activeTab)
    : [];

  return (
    <div className="container mt-4 p-4 min-vh-100">
      <h2 className="fw-bold text-success mb-4 text-center">🏆 Cricket Tournament History</h2>

      {/* Tournament Filter Buttons */}
      <div className="d-flex gap-2 mb-5 justify-content-center overflow-auto pb-2">
        {tournaments.map((tab) => (
          <button 
            key={tab}
            className={`btn rounded-pill px-4 fw-bold shadow-sm transition-all ${
              activeTab === tab ? 'btn-success text-white' : 'btn-outline-success bg-white'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Display Grid */}
      <div className="row g-4">
        {loading ? (
          <div className="text-center w-100 py-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-2">Loading historical data...</p>
          </div>
        ) : error ? (
          <div className="text-center w-100 py-5 text-danger">{error}</div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div className="col-md-4" key={item._id || index}>
              <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white border-bottom border-success border-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-light text-success border border-success px-3 py-2 rounded-pill">
                    Year: {item.year}
                  </span>
                  <i className="bi bi-trophy-fill text-warning fs-4"></i>
                </div>
                <h4 className="fw-bold text-dark">{item.winner}</h4>
                <p className="text-muted mb-1">
                  🥈 Runner Up: <span className="text-dark fw-semibold">{item.runnerUp}</span>
                </p>
                <p className="text-muted mb-0">
                  📍 Host: <span className="text-dark fw-semibold">{item.host}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 w-100 text-muted">
            <i className="bi bi-search display-1 text-light"></i>
            <p className="mt-3">No records found for {activeTab} yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;