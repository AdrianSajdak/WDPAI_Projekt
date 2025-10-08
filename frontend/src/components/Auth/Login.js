import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import useAuth from '../../hooks/useAuth';
import '../../styles/Login.css';

function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.username, formData.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Incorrect credentials.');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('credentialResponse = ', credentialResponse);
    try {
      const googleToken = credentialResponse.credential;
      if (!googleToken) {
        setError('No credential from Google');
        return;
      }
      const success = await googleLogin(googleToken);
      if (success) navigate('/dashboard');
      else setError('Google login failed (server).');
    } catch (err) {
      console.error(err);
      setError('Google login error.');
    }
  };

  const handleGoogleError = () => {
    setError('Google login error. (Popup closed?)');
  };

  return (
    <div className="auth-page accent-veil">
      <div className="auth-card surface-card">
        <div className="auth-layout">
          <aside className="auth-side">
            <div className="auth-side__content">
              <span className="auth-badge">GymManagement</span>
              <h2>Training made beautifully simple.</h2>
              <p>
                Plan sessions, monitor memberships, and keep the motivation high with a clear view of
                everything that matters.
              </p>
              <ul>
                <li>Instant access to upcoming classes</li>
                <li>Membership renewals with one click</li>
                <li>Personalized trainer collaboration</li>
              </ul>
            </div>
          </aside>

          <div className="auth-content">
            <div className="auth-header">
              <span className="chip accent">Welcome back</span>
              <h3>Log in to your account</h3>
              <p className="muted-text">
                Manage your classes, memberships, and trainer collaborations from a single dashboard.
              </p>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span>Username or email</span>
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
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="auth-input"
                  autoComplete="current-password"
                />
              </label>

              <button type="submit" className="btn-primary auth-submit">
                Log in
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
