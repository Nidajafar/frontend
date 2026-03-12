import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://cricket-project-tau.vercel.app/api/users/signup', formData);
      alert("Registration Successful");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "Signup fail");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: '400px' }}>
        <h2 className="text-center fw-bold text-success mb-4">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control rounded-pill" 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control rounded-pill" 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              autoComplete='new-password'
              className="form-control rounded-pill required" 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-pill">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;