import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Navbar.css'; 

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // LocalStorage se user info nikalna
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: "Kya aap waqai logout karna chahte hain?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear all session data
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userInfo');
        
        Swal.fire({
          title: 'Logged Out!',
          text: 'Aap kamyabi se logout ho gaye hain.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        navigate('/login');
      }
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-lg fixed-top" 
         style={{ 
           backgroundColor: '#064e3b', 
           borderBottom: '3px solid #d4af37',
           padding: '0.8rem 1rem' 
         }}>
      <div className="container-fluid px-md-5">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{ letterSpacing: '1.5px' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🏆</span>
          <span style={{ color: '#d4af37' }}>NJ CRICKET</span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <Link className={`nav-link text-uppercase fw-semibold ${isActive('/') ? 'active-gold' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-uppercase fw-semibold ${isActive('/schedule') ? 'active-gold' : ''}`} to="/schedule">Matches</Link>
            </li>
             <li className="nav-item">
              <Link className={`nav-link text-uppercase fw-semibold ${isActive('/live') ? 'active-gold' : ''}`} to="/live">Live</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-uppercase fw-semibold ${isActive('/Teams') ? 'active-gold' : ''}`} to="/Teams">Teams</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-uppercase fw-semibold ${isActive('/stats') ? 'active-gold' : ''}`} to="/stats">Stats</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-uppercase fw-semibold ${isActive('/history') ? 'active-gold' : ''}`} to="/history">History</Link>
            </li>
            
            {/*  ADMIN OPTION: Sirf tab dikhega jab user Admin ho */}
            {userInfo?.role === 'admin' && (
              <li className="nav-item">
                <Link className={`nav-link text-uppercase fw-bold ${isActive('/admin-dashboard') ? 'active-gold' : ''}`} to="/admin-dashboard" style={{ color: '#d4af37' }}>
                  ⚙️ Admin Hub
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {userInfo ? (
              <>
                <div className="text-end d-none d-lg-block border-end pe-3 me-1 border-secondary">
                  <div className="small text-white-50 text-uppercase" style={{ fontSize: '0.6rem' }}>Welcome</div>
                  <div className="fw-bold" style={{ color: '#d4af37', fontSize: '0.9rem' }}>{userInfo.name}</div>
                </div>
                {/* 🚪 LOGOUT OPTION */}
                <button onClick={handleLogout} className="btn btn-outline-warning btn-sm rounded-pill px-4 fw-bold">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-gold btn-sm rounded-pill px-4 fw-bold">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;