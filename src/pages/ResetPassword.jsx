import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams(); // URL se token lene ke liye
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return Swal.fire('Error', 'Passwords do not match!', 'error');
    }

    try {
      await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { password });
      Swal.fire('Success!', 'Password has been reset. Login now.', 'success');
      navigate('/login');
    } catch (err) {
      console.error("Reset Password Error:", err);
      Swal.fire('Error', 'Link expired or invalid!', 'error');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 border-0 rounded-4" style={{ width: '400px' }}>
        <h4 className="fw-bold text-center mb-3">Set New Password</h4>
        <form onSubmit={handleReset} autoComplete="off">
          <div className="mb-3">
            <label className="small fw-bold">New Password</label>
            <input 
              type="password" 
              className="form-control rounded-pill" 
              placeholder="Min 6 characters"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="small fw-bold">Confirm New Password</label>
            <input 
              type="password" 
              className="form-control rounded-pill" 
              placeholder="Re-type password"
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          <button className="btn btn-success w-100 rounded-pill fw-bold">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;