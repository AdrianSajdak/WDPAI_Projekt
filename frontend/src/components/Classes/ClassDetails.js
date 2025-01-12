// src/components/Classes/ClassDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import '../styles/App.css';

function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await axiosClient.get(`/classes/${id}/`);
        setClassData(response.data);
      } catch (err) {
        console.error(err);
        setError('Nie udało się pobrać szczegółów zajęć.');
      }
    };
    fetchClass();
  }, [id]);

  const handleJoin = async () => {
    try {
      await axiosClient.post(`/classes/${id}/join/`);
      alert('Zapisano na zajęcia!');
      const updated = await axiosClient.get(`/classes/${id}/`);
      setClassData(updated.data);
    } catch (err) {
      alert(err?.response?.data?.detail || 'Błąd przy zapisie.');
    }
  };

  const handleLeave = async () => {
    try {
      await axiosClient.post(`/classes/${id}/leave/`);
      alert('Wypisano z zajęć!');
      const updated = await axiosClient.get(`/classes/${id}/`);
      setClassData(updated.data);
    } catch (err) {
      alert(err?.response?.data?.detail || 'Błąd przy wypisie.');
    }
  };

  if (error) return <p style={{color: 'red'}}>{error}</p>;
  if (!classData) return <p>Ładowanie danych o zajęciach...</p>;

  const freeSpots = classData.capacity - (classData.attendees?.length || 0);

  return (
    <div>
      <h2>{classData.name}</h2>
      <p>{classData.description}</p>
      <p>Start: {classData.start_time} | Koniec: {classData.end_time}</p>
      <p>Wolnych miejsc: {freeSpots} / {classData.capacity}</p>

      <button onClick={handleJoin}>Zapisz się</button>
      <button onClick={handleLeave}>Wypisz się</button>

      <br /><br />
      <button onClick={() => navigate('/classes')}>Powrót do listy</button>
    </div>
  );
}

export default ClassDetails;
