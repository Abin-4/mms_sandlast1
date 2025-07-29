import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'mms' && password === 'mms123') {
      alert('Login successful!');
      navigate('/side');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="login-header">
          <img src="https://cdn-icons-png.flaticon.com/512/295/295128.png" alt="Admin Icon" className="admin-icon" />
          <h2 className="admin-login-title">Admin Portal</h2>
          <p className="login-subtitle">Mineral Management System</p>
        </div>
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="admin-login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;