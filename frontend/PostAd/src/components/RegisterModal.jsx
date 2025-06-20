import React, { useState } from 'react';
import API from '../api/api';
import '../styles/RegisterModal.css';

function RegisterModal({ close, switchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", form);
      alert(res.data.message); // "OTP sent"
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleOtpVerify = async () => {
    try {
      const res = await API.post("/auth/verify-otp", {
        contact: form.email || form.phone,
        otp
      });
      alert(res.data.message); // "OTP verified"
      close(); // Close modal
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>×</button>

        {!otpSent ? (
          <form className="register-form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="phone" placeholder="Phone" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Register</button>

            <p className="login-text">
              Already have an account?{" "}
              <span className="login-link" onClick={switchToLogin}>Login</span>
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
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterModal;
