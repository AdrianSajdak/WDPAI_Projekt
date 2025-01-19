import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import '../../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
    termsAccepted: false,
    is_trainer: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setError('Passwords do not match!');
      setSuccess('');
      return;
    }
    if (!formData.termsAccepted) {
      setError('You must accept the terms first.');
      setSuccess('');
      return;
    }

    const payload = {
      username: formData.email,
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      // is_trainer: formData.is_trainer, // if your backend expects it
    };

    try {
      await axiosClient.post('/register/', payload);
      setSuccess('Account created. You can now log in.');
      setError('');
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration.');
      setSuccess('');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-icon">
          {/* optional icon */}
          <h2>Register</h2>
        </div>

        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password2"
              placeholder="Repeat Password"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>

          <div className="terms-group">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label>I accept the Terms of Use & Privacy Policy</label>
          </div>

          <div className="trainer-group">
            <input
              type="checkbox"
              name="is_trainer"
              checked={formData.is_trainer}
              onChange={handleChange}
            />
            <label> Are you a trainer?</label>
          </div>

          <button type="submit" className="btn-green">SIGN UP</button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>
        <p className="login-with">log in with</p>
        <div className="social-icons">
          <button className="btn-social google">
            {/* Google icon */}
          </button>
          <button className="btn-social facebook">
            {/* Facebook icon */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
