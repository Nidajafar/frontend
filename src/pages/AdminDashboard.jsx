import React, { useState } from 'react';
import ManageTeams from '../components/Admin/ManageTeam';
import ManageHistory from '../components/Admin/ManageHistory';
import ManageMatches from '../components/Admin/ManageMatches';
import ManageStats from '../components/Admin/ManageStats'; // Naya component import kiya

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('teams');

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold text-uppercase text-white">Admin Central Hub</h1>
          <p className="fw-bold" style={{ color: '#d4af37' }}>Control Everything from Here</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center mb-4">
          <div className="col-md-11">
            <div className="d-flex flex-wrap justify-content-center gap-2 bg-white p-2 shadow-sm rounded-pill">
              <button className={`btn rounded-pill px-3 fw-bold ${activeTab === 'teams' ? 'btn-emerald' : 'btn-light'}`} onClick={() => setActiveTab('teams')}>🏏 Teams</button>
              <button className={`btn rounded-pill px-3 fw-bold ${activeTab === 'history' ? 'btn-emerald' : 'btn-light'}`} onClick={() => setActiveTab('history')}>📜 History</button>
              <button className={`btn rounded-pill px-3 fw-bold ${activeTab === 'matches' ? 'btn-emerald' : 'btn-light'}`} onClick={() => setActiveTab('matches')}>🏟️ Matches</button>
              <button className={`btn rounded-pill px-3 fw-bold ${activeTab === 'stats' ? 'btn-emerald' : 'btn-light'}`} onClick={() => setActiveTab('stats')}>📊 Player Stats</button>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-11">
            {activeTab === 'teams' && <ManageTeams />}
            {activeTab === 'history' && <ManageHistory />}
            {activeTab === 'matches' && <ManageMatches />}
            {activeTab === 'stats' && <ManageStats />} {/* Naya Tab render ho raha hai */}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .btn-emerald { background-color: #064e3b; color: #d4af37; border: none; }
        .btn-light { color: #64748b; border: none; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;