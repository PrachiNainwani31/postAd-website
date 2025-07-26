import React, { useState, useContext } from 'react';
import '../styles/LoginPage.css';
import API from '../api/api';
// import axios from 'axios'; // 🛑 REMOVED: No longer needed
import { AuthContext } from '../context/AuthContext';

function LoginModal({ close, switchToRegister }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showForgotLink, setShowForgotLink] = useState(false);

  // Forgot password state
  const [resetStep, setResetStep] = useState('idle'); // 'idle' | 'sent' | 'verify'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
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
      // ✅ CHANGED: Use the API instance
      await API.post('/auth/forgot-password', { email: form.email });
      setResetMessage(`OTP sent to ${form.email}`);
      setResetStep('sent');
    } catch (err) {
      setResetMessage(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // ✅ CHANGED: Use the API instance
      await API.post('/auth/reset-password', {
        email: form.email,
        otp,
        newPassword
      });
      setResetMessage('Password reset successful. Please login with your new password.');
      setResetStep('verify');
      setShowForgotLink(false);
    } catch (err) {
      setResetMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const renderLoginForm = () => (
    <>
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

      {showForgotLink && (
        <div className="forgot-link-container">
          <p>
            <span className="forgot-link" onClick={handleSendOtp}>
              Forgot password?
            </span>
          </p>
        </div>
      )}

      {!showForgotLink && (
        <p className="register-text">
          Don't have an account?{' '}
          <span className="register-link" onClick={switchToRegister}>
            Register
          </span>
        </p>
      )}
    </>
  );

  const renderOtpResetForm = () => (
    <div className="reset-container">
      <h2>Reset Password</h2>
      {resetStep === 'sent' && <p className="info-text">{resetMessage}</p>}

      {(resetStep === 'sent' || resetStep === 'verify') && (
        <>
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
          <button className="btn" onClick={handleVerifyOtp}>
            Reset Password
          </button>
          {resetStep === 'verify' && <p className="info-text">{resetMessage}</p>}
          {resetStep === 'sent' && (
            <button className="btn resend-btn" onClick={handleSendOtp}>
              Resend OTP
            </button>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>
          ×
        </button>

        {resetStep === 'idle' ? renderLoginForm() : renderOtpResetForm()}
      </div>
    </div>
  );
}

export default LoginModal;