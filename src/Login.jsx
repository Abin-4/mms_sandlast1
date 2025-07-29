import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginAdmin } from './Server/allAPI';
import './Login.css';

const Login = () => {
  const location = useLocation();
  const { registeredUser } = location.state || {};
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, setLoginUser] = useState({ 
    lesseeId: registeredUser?.lesseeId || '', 
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { lesseeId, password } = loginUser;

    if (!lesseeId || !password) {
      alert("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginAdmin({ lesseeId, password });

      if (result.status === 200) {
        alert("Login successful!");
        navigate('/userdasboard', { 
          state: { 
            userData: result.data.user 
          } 
        });
      } else if (result.status === 403) {
        alert("Please complete your registration first");
        navigate('/register', { state: { newUserData: { _id: result.data.userId } } });
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="login-header">
          <img src="https://cdn-icons-png.flaticon.com/512/295/295128.png" alt="User Icon" className="admin-icon" />
          <h2 className="admin-login-title">User Login</h2>
          <p className="login-subtitle">Mineral Management System</p>
        </div>
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Username (Lessee ID)
            </label>
            <input
              id="username"
              type="text"
              value={loginUser.lesseeId}
              onChange={(e) => setLoginUser({ ...loginUser, lesseeId: e.target.value })}
              placeholder="Enter username"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={loginUser.password}
                onChange={(e) => setLoginUser({ ...loginUser, password: e.target.value })}
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
              <span 
                className="password-toggle"
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button 
            type="submit" 
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login-links">
          <Link to="/register" className="login-link">Register</Link>
          <Link to="/admin" className="login-link">Admin Login</Link>
          <Link to="/forgotp" className="login-link">Forgot Password</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;