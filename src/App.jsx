import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar'; 

// Pages
import Dashboard from './pages/Dashboard';
import StatsPage from './pages/StatePage';
import Matches from './pages/Matches';
import LiveWatch from './pages/LiveWatch';
import AdminDashboard from './pages/AdminDashboard'; // 🏆 Single Admin Hub
import CricketTeams from './pages/Team';
import Login from './pages/Login';
import Signup from './pages/Signup';
import History from './pages/History';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedAdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (!userInfo || userInfo.role !== 'admin') {
    return (
      <div className="container text-center mt-5 p-5 bg-white shadow rounded-4 animate__animated animate__shakeX">
        <h1 className="display-1">🚫</h1>
        <h2 className="text-danger fw-bold">Access Denied!</h2>
        <p className="text-muted">Sirf Admin hi is page ko dekh sakta hai.</p>
        <button onClick={() => window.location.href = '/'} className="btn btn-success rounded-pill mt-3 px-4 shadow">
          Wapas Home par jayein
        </button>
      </div>
    );
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container min-vh-100 d-flex flex-column overflow-hidden" style={{ width: '100vw' }}>
        
        {/* 1. TOP NAVBAR (Sticky & Reusable) */}
        <Navbar />

        {/* 2. MAIN CONTENT AREA */}
        <main className="flex-grow-1 bg-light pt-5 mt-2">
          <div className="row g-0"> 
            <div className="col-12">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/schedule" element={<Matches />} />
                <Route path="/live" element={<LiveWatch />} />
                <Route path="/Teams" element={<CricketTeams />} />
                <Route path="/history" element={<History />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword/>} />

              // ... baki imports
                <Route 
                      path="/admin-dashboard" // Navbar ke link se match karne ke liye
                            element={
                     <ProtectedAdminRoute>
                         <AdminDashboard />
                    </ProtectedAdminRoute>
                                         } 
                                            />

                {/* Redirect old routes to the new single dashboard */}
                <Route path="/admin-teams" element={<Navigate to="/admin-dashboard" replace />} />
                <Route path="/admin/form" element={<Navigate to="/admin-dashboard" replace />} />

                {/* 404 Route */}
                <Route path="*" element={<div className="text-center py-5"><h3>Oops! Page Not Found</h3></div>} />
              </Routes>
            </div>
          </div>
        </main>

        {/* 3. FOOTER */}
        <footer className="bg-dark text-white text-center py-4 mt-auto w-100 shadow-lg" style={{ borderTop: '3px solid #d4af37' }}>
          <p className="small mb-0 opacity-75 fw-bold">© 2026 NJ CRICKET | Premium Tournament Partner</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;