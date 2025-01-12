// src/components/Auth/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import '../../styles/Login.css';

import logo from '../../images/logo.png'

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
      setError('Błędne dane logowania.');
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
          <img src={logo} alt="logo" />

        </div>

        {/* Komunikat błędu */}
        {error && <p className="error">{error}</p>}

        {/* Formularz */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path d="M28.1067 10.2921L17 18.4663L5.89334 10.2921M4.58293 7.58625C4.2072 7.58625 3.84687 7.73551 3.58119 8.00118C3.31552 8.26686 3.16626 8.6272 3.16626 9.00292V25.0183C3.16626 25.3941 3.31552 25.7544 3.58119 26.0201C3.84687 26.2857 4.2072 26.435 4.58293 26.435H29.4171C29.7928 26.435 30.1531 26.2857 30.4188 26.0201C30.6845 25.7544 30.8338 25.3941 30.8338 25.0183V8.98167C30.8338 8.60595 30.6845 8.24561 30.4188 7.97993C30.1531 7.71426 29.7928 7.565 29.4171 7.565H4.58293V7.58625Z" stroke="#39722B" stroke-width="0.416667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <input
              type="text"
              name="username"
              placeholder="E-Mail"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path d="M17 17.9067C16.4941 17.9086 16.0027 18.0767 15.6016 18.3851C15.2005 18.6935 14.9117 19.1251 14.7798 19.6135C14.6478 20.102 14.6799 20.6202 14.8712 21.0887C15.0624 21.5571 15.4022 21.9497 15.8383 22.2063V25.5H18.19V22.2063C18.5351 22.0021 18.8214 21.7122 19.0213 21.3647C19.2211 21.0171 19.3276 20.6238 19.3304 20.2229V20.2229C19.3304 19.9175 19.2701 19.6152 19.1528 19.3332C19.0355 19.0513 18.8636 18.7953 18.647 18.5801C18.4304 18.3648 18.1734 18.1945 17.8908 18.0789C17.6081 17.9633 17.3054 17.9048 17 17.9067V17.9067Z" stroke="#39722B" stroke-width="0.416667" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M25.7055 12.5871H8.28754C6.59755 12.5871 5.22754 13.9571 5.22754 15.6471V27.7525C5.22754 29.4425 6.59755 30.8125 8.28754 30.8125H25.7055C27.3954 30.8125 28.7655 29.4425 28.7655 27.7525V15.6471C28.7655 13.9571 27.3954 12.5871 25.7055 12.5871Z" stroke="#39722B" stroke-width="0.416667" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9.4563 12.5871V10.7383C9.4563 8.73573 10.2518 6.81514 11.6679 5.39909C13.0839 3.98303 15.0045 3.1875 17.0071 3.1875C19.0097 3.1875 20.9303 3.98303 22.3464 5.39909C23.7624 6.81514 24.558 8.73573 24.558 10.7383V12.5871" stroke="#39722B" stroke-width="0.416667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
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

        {/* Sekcja "or / login with" */}
        <div className="divider">
          <span>or</span>
        </div>
        <p className="login-with">login with</p>
        <div className="social-icons">
          <button className="btn-social google">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <g clip-path="url(#clip0_1_234)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C10.744 0 0 10.746 0 24C0 37.254 10.744 48 24 48C37.254 48 48 37.254 48 24C48 10.746 37.254 0 24 0ZM24.28 38.036C16.544 38.036 10.28 31.756 10.28 24C10.28 16.244 16.544 9.964 24.28 9.964C28.06 9.964 31.22 11.358 33.644 13.622L29.696 17.578V17.57C28.226 16.166 26.362 15.446 24.28 15.446C19.66 15.446 15.906 19.358 15.906 23.992C15.906 28.622 19.66 32.546 24.28 32.546C28.472 32.546 31.324 30.142 31.912 26.842H24.28V21.368H37.45C37.626 22.308 37.72 23.288 37.72 24.316C37.72 32.336 32.366 38.036 24.28 38.036Z" fill="#39722B" />
              </g>
              <defs>
                <clipPath id="clip0_1_234">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
          <button className="btn-social facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <g clip-path="url(#clip0_1_230)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 24.134C0 36.066 8.666 45.988 20 48V30.666H14V24H20V18.666C20 12.666 23.866 9.334 29.334 9.334C31.066 9.334 32.934 9.6 34.666 9.866V16H31.6C28.666 16 28 17.466 28 19.334V24H34.4L33.334 30.666H28V48C39.334 45.988 48 36.068 48 24.134C48 10.86 37.2 0 24 0C10.8 0 0 10.86 0 24.134Z" fill="#39722B" />
              </g>
              <defs>
                <clipPath id="clip0_1_230">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
