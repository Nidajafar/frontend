import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Loading alert
    Swal.fire({
      title: 'Verifying...',
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await axios.post('cricket-project-tau.vercel.app/api/users/login', { email, password });
      
      // ✅ Sabse important step: Data ko sahi key (userInfo) se save karna
      // Agar backend 'user' object bhej raha hai to res.data.user use hoga, warna poora res.data
      const userData = res.data.user || res.data;
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', userData.role);

      Swal.fire({
        title: `Welcome, ${userData.name}!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // Redirect to home or dashboard
      navigate('/');
      
      // Page refresh taake Navbar update ho jaye
      window.location.reload();

    } catch (err) {
      Swal.fire({
        title: 'Login Failed',
        text: err.response?.data?.message || 'Invalid email or password',
        icon: 'error'
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ width: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#064e3b' }}>NJ CRICKET</h2>
          <p className="text-muted small">Login to manage your cricket hub</p>
        </div>

        {/* 🔒 autoComplete="off" password save suggestions ko rokta hai */}
        <form onSubmit={handleLogin} autoComplete="off">
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input 
              type="email" 
              className="form-control rounded-pill px-3" 
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)} 
              autoComplete="new-password"
              required 
            />
          </div>

          <div className="mb-2">
            <label className="form-label small fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control rounded-pill px-3" 
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="new-password"
              required 
            />
          </div>

          <div className="text-end mb-4">
            <Link to="/forgot-password" d-block text-end small className="text-decoration-none text-success fw-bold small">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold py-2">
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small text-muted">
            Don't have an account? <Link to="/signup" className="text-success text-decoration-none fw-bold">Signup karein</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;