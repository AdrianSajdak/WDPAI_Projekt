// src/components/Auth/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div>
      <h2>Logowanie</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nazwa użytkownika</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div>
          <label>Hasło</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
}

export default Login;
