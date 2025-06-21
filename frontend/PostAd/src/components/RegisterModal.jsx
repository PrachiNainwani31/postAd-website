import React, { useState } from 'react';
import '../styles/RegisterModal.css';
import API from '../api/api';

function RegisterModal({ close, switchToLogin, setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", form);
      setSuccess("OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleOtpVerify = async () => {
    try {
      const res = await API.post("/auth/verify-otp", {
        contact: form.email,
        otp
      });

      const loginRes = await API.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      const { token, user } = loginRes.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setSuccess("Registration successful");
      close();
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>×</button>

        {!otpSent ? (
          <form className="register-form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit">Register</button>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
            <p className="login-text">
              Already have an account? <span className="login-link" onClick={switchToLogin}>Login</span>
            </p>
          </form>
        ) : (
          <form className="register-form" onSubmit={(e) => { e.preventDefault(); handleOtpVerify(); }}>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterModal;
