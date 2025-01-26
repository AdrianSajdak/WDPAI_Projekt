import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/Login.css';

function Login() {
  const { login } = useAuth();
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
        <p className="login-with">log in with</p>

        <div className="social-icons">
          <button className="btn-social">
            <img src={require('../../images/akar-icons_google-contained-fill.png')}></img>
          </button>
          <button className="btn-social">
          <img src={require('../../images/akar-icons_facebook-fill.png')}></img>

          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
