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

  const googleAuth = GoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icon">
        <img src={require('../../images/logo.png')} alt="logo"></img>
          <h2>Login</h2>
        </div>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Email or Username"
              value={formData.username}
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

          <button type="submit" className="btn-green">
            LOG IN
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>
        <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
      </div>
    </div>
  );
}

export default Login;
