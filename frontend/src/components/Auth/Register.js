// src/components/Auth/Register.js

import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_trainer: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/register/', formData);
      setSuccess('Konto zostało utworzone. Możesz się zalogować.');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Wystąpił błąd podczas rejestracji.');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Rejestracja</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nazwa użytkownika</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Adres e-mail</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Hasło</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Czy trener?</label>
          <input 
            type="checkbox"
            name="is_trainer"
            checked={formData.is_trainer}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
}

export default Register;
