import React, { useState } from 'react';
import '../styles/LoginPage.css';
import API from '../api/api';

function LoginModal({ close, switchToRegister,setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

   const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post('/auth/login', form);
    setSuccess('Login successful');
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token); // Save token
    close();
  } catch (err) {
    if (err.response?.data?.message.includes('not found')) {
      setError('Incorrect email');
    } else if (err.response?.data?.message.includes('Incorrect password')) {
      setError('Incorrect password');
    } else {
      setError('Login failed');
    }
  }
};


  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>×</button>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
           onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
        </form>

        <p className="register-text">
          Don't have an account?{' '}
          <span className="register-link" onClick={switchToRegister}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
