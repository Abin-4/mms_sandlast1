import React, { useState, useEffect } from 'react';
import './RegistrationPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminAddQuaeyAPI, updateAdminWithCredentials } from './Server/allAPI';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';

const RegisterPage = () => {
  const location = useLocation();
  const { newUserData } = location.state || {};
  
  const [user, setUser] = useState({
    fullName: newUserData?.registrationHolderName || '',
    email: '',
    username: newUserData?.lesseeId || '',
    password: '',
    confirmPassword: '',
  });

  const [formData, setFormData] = useState(newUserData || {});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const handleRegister = async (e) => {
  e.preventDefault();

  const { fullName, email, username, password, confirmPassword } = user;

  // Basic validation
  if (!fullName || !email || !username || !password) {
    alert("Please fill all required fields!");
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  setIsLoading(true);
  try {

    const decrementWithLeadingZeros = (value) => {
      if (!value) return value;
      const num = parseInt(value, 10);
      const originalLength = value.length;
      return String(num).padStart(originalLength, '0');
    };
    // Prepare submission data
    const submissionData = {
      ...formData,
      SerialNo: decrementWithLeadingZeros(formData.SerialNo),
      dispatchNo: decrementWithLeadingZeros(formData.dispatchNo),
      lesseeId: String(formData.lesseeId).padStart(6, '0'),
      email // Make sure email is included
    };

    // First create the admin query entry
    const queryResponse = await adminAddQuaeyAPI(submissionData);
    
    if (!queryResponse.data.success) {
      throw new Error(queryResponse.data.message);
    }

    // Then register the user credentials
    const reqBody = {
      userId: queryResponse.data.data._id,
      fullname: fullName,
      email,
      lesseeId: username,
      password
    };

    const result = await updateAdminWithCredentials(reqBody);

    if (result.status === 200) {
      alert("Registration successful! You can now login.");
      navigate('/');
    } else {
      throw new Error('Failed to register user');
    }
  } catch (error) {
    console.error("Registration error:", error);
    // Show specific error message from backend or generic message
    alert(error.message || "This email already exist.");
  } finally {
    setIsLoading(false);
  }
};


  return (
<div className="admin-login-container">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        closeButton={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="admin-login-box">
        <div className="login-header">
          <img src="https://cdn-icons-png.flaticon.com/512/295/295128.png" alt="Admin Icon" className="admin-icon" />
          <h2 className="admin-login-title">Mineral Management System</h2>
          <p className="login-subtitle">Create your account</p>
        </div>

        <form onSubmit={handleRegister} className="admin-login-form">
          <div className="form-group">
            <label>
              <i className="fas fa-user"></i> Full Name *
            </label>
            <input
              type="text"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              required
              disabled={!!newUserData?.registrationHolderName}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-envelope"></i> Email Address *
            </label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-id-card"></i> Lessee ID *
            </label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
              disabled={!!newUserData?.lesseeId}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i> Password *
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
                minLength="6"
                className="form-input"
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i> Confirm Password *
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={user.confirmPassword}
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                required
                minLength="6"
                className="form-input"
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className={`admin-login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-loader"></span>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>

        <div className="login-redirect">
          Already registered? <a href="/" className="login-link">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;