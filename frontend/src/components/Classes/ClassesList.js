// src/components/Classes/ClassesList.js

import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import '../styles/App.css';

function ClassesList() {
  const [classesList, setClassesList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosClient.get('/classes/');
        setClassesList(response.data);
      } catch (err) {
        console.error(err);
        setError('Nie udało się pobrać listy zajęć.');
      }
    };
    fetchClasses();
  }, []);

  const handleJoin = async (classId) => {
    try {
      await axiosClient.post(`/classes/${classId}/join/`);
      alert('Zapisano na zajęcia!');
      const updated = await axiosClient.get('/classes/');
      setClassesList(updated.data);
    } catch (err) {
      alert(err?.response?.data?.detail || 'Błąd przy zapisie.');
    }
  };

  const handleLeave = async (classId) => {
    try {
      await axiosClient.post(`/classes/${classId}/leave/`);
      alert('Wypisano z zajęć!');
      const updated = await axiosClient.get('/classes/');
      setClassesList(updated.data);
    } catch (err) {
      alert(err?.response?.data?.detail || 'Błąd przy wypisie.');
    }
  };

  return (
    <div>
      <h2>Zajęcia grupowe</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {classesList.length === 0 ? (
        <p>Brak dostępnych zajęć.</p>
      ) : (
        <ul>
          {classesList.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong> — {c.description}
              <p>Od: {c.start_time} &nbsp;|&nbsp; Do: {c.end_time}</p>
              <p>Miejsca: {c.capacity - (c.attendees?.length || 0)} / {c.capacity}</p>
              <button onClick={() => handleJoin(c.id)}>Zapisz się</button>
              <button onClick={() => handleLeave(c.id)}>Wypisz się</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClassesList;
