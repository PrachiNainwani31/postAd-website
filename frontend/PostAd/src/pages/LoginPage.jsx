import React, { useState, useContext } from 'react';
import '../styles/LoginPage.css';
import API from '../api/api';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function LoginModal({ close, switchToRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showForgotLink, setShowForgotLink] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      close();
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      if (msg.includes('not found')) {
        setError('User not registered with this email');
      } else if (msg.includes('Incorrect password')) {
        setError('Incorrect password');
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
          setShowForgotLink(true);
        }
      } else {
        setError(msg);
      }
    }
  };

  const handleSendOtp = async () => {
    try {
      await axios.post('http://localhost:5001/api/auth/forgot-password', {
        email: form.email,
      });
      setResetMessage('OTP sent to your email');
      setOtpSent(true);
    } catch (err) {
      setResetMessage(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:5001/api/auth/reset-password', {
        email: form.email,
        otp,
        newPassword,
      });
      setResetMessage('Password updated successfully! You can now log in.');
      setOtp('');
      setNewPassword('');
      setOtpSent(false);
      setShowForgotLink(false);
    } catch (err) {
      setResetMessage(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>×</button>

        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-text">{error}</p>}
        </form>

        {showForgotLink && !otpSent && (
          <div className="forgot-block">
            <p className="forgot-label">Forgot password?</p>
            <button className="btn" onClick={handleSendOtp}>Send OTP</button>
          </div>
        )}

        {otpSent && (
          <div className="reset-section">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button className="btn" onClick={handleResetPassword}>Reset Password</button>
          </div>
        )}

        {resetMessage && <p className="info-text">{resetMessage}</p>}

        {!otpSent && !showForgotLink && (
          <p className="register-text">
            Don't have an account?{' '}
            <span className="register-link" onClick={switchToRegister}>Register</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
  