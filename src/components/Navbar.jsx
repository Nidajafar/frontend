import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Navbar.css'; 

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: "Are you sure you want to logout?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/login');
      }
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-lg fixed-top" 
         style={{ backgroundColor: '#064e3b', borderBottom: '3px solid #d4af37' }}>
      <div className="container-fluid px-md-5">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🏆</span>
          <span style={{ color: '#d4af37' }}>NJ CRICKET</span>
        </Link>

        {/* Hamburger Button */}
        <button 
          className="navbar-toggler shadow-none border-0" 
          type="button" 
          onClick={handleNavCollapse}
          aria-expanded={!isNavCollapsed} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="mainNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2 mt-3 mt-lg-0">
            {[
              { name: 'Home', path: '/' },
              { name: 'Matches', path: '/schedule' },
              { name: 'Live', path: '/live' },
              { name: 'Teams', path: '/Teams' },
              { name: 'Stats', path: '/stats' },
              { name: 'History', path: '/history' }
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <Link 
                  className={`nav-link text-uppercase fw-semibold ${isActive(item.path) ? 'active-gold' : ''}`} 
                  to={item.path}
                  onClick={() => setIsNavCollapsed(true)} // Closes menu on click
                >
                  {item.name}
                </Link>
              </li>
            ))}
            
            {userInfo?.role === 'admin' && (
              <li className="nav-item">
                <Link 
                  className={`nav-link text-uppercase fw-bold ${isActive('/admin-dashboard') ? 'active-gold' : ''}`} 
                  to="/admin-dashboard" 
                  style={{ color: '#d4af37' }}
                  onClick={() => setIsNavCollapsed(true)}
                >
                  ⚙️ Admin Hub
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 pb-3 pb-lg-0">
            {userInfo ? (
              <>
                <div className="text-white">
                  <div className="small text-white-50" style={{ fontSize: '0.7rem' }}>Welcome</div>
                  <div className="fw-bold" style={{ color: '#d4af37' }}>{userInfo.name}</div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline-warning btn-sm rounded-pill px-4">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-warning btn-sm rounded-pill px-4 fw-bold" style={{backgroundColor: '#d4af37'}}>Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;