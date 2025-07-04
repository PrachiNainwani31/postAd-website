import React, { useState } from 'react';
import '../styles/RegisterModal.css';
import API from '../api/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function RegisterModal({ close, switchToLogin}) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useContext(AuthContext);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  console.log("Register form data:", form); // 👈 log it
  try {
    const res = await API.post("/auth/register", form);
    setSuccess("OTP sent to your email");
    setOtpSent(true);
  } catch (err) {
    console.error("Register Error:", err.response?.data); // log backend error
    setError(err.response?.data?.message || "Registration failed");
  }
};

  const handleOtpVerify = async (e) => {
    e.preventDefault();
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
      login(user);  
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
          <form className="register-form" onSubmit= {handleRegister}>
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
          <form className="register-form" onSubmit={ handleOtpVerify}>
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
