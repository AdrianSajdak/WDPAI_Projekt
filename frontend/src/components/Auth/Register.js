import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import '../../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    termsAccepted: false,
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
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
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
    <div className="auth-page accent-veil">
      <div className="auth-card surface-card">
        <div className="auth-layout">
          <aside className="auth-side">
            <div className="auth-side__content">
              <span className="auth-badge">Premium access</span>
              <h2>Grow stronger with tailored guidance.</h2>
              <p>
                Unlock curated training plans, track your progress, and connect effortlessly with your trainers
                and community.
              </p>
              <ul>
                <li>Save preferred classes and standby lists</li>
                <li>Enjoy flexible membership controls</li>
                <li>Collaborate with certified trainers</li>
              </ul>
            </div>
          </aside>

          <div className="auth-content">
            <div className="auth-header">
              <span className="chip accent">Create your space</span>
              <h3>Join GymManagement</h3>
              <p className="muted-text">
                Build stronger habits with streamlined membership management and curated class discovery.
              </p>
            </div>

            {success && <p className="auth-success">{success}</p>}
            {error && <p className="auth-error">{error}</p>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field-grid">
                <label className="auth-field">
                  <span>First name</span>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="auth-input"
                    autoComplete="given-name"
                  />
                </label>
                <label className="auth-field">
                  <span>Last name</span>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="auth-input"
                    autoComplete="family-name"
                  />
                </label>
              </div>

              <label className="auth-field">
                <span>Username</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="auth-input"
                  autoComplete="username"
                />
              </label>

              <label className="auth-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="auth-input"
                  autoComplete="email"
                />
              </label>

              <div className="auth-field-grid">
                <label className="auth-field">
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="auth-input"
                    autoComplete="new-password"
                  />
                </label>
                <label className="auth-field">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                    className="auth-input"
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <label className="auth-terms">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                />
                <span>
                  I agree to the{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Terms of Use
                  </a>{' '}
                  and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button type="submit" className="btn-primary auth-submit">
                Create account
              </button>
            </form>

            <p className="auth-secondary">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
