import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({ title: 'Sending...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      await axios.post('http://localhost:5000/api/users/forgot-password', { email:email.toLocaleLowerCase() });
      Swal.fire('Success!', 'Check your email for reset link.', 'success');
    } catch (err) {
      console.error("Forgot Password Error:", err);
      Swal.fire('Error', 'Email not found!', 'error');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 border-0 rounded-4" style={{ width: '380px' }}>
        <h4 className="fw-bold text-center mb-3">Forgot Password?</h4>
        <p className="text-muted small text-center">Enter your email and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="form-control rounded-pill mb-3" 
            placeholder="Enter your email" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button className="btn btn-success w-100 rounded-pill fw-bold">Send Reset Link</button>
         
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
