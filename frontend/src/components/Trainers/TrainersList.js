// src/components/Trainers/TrainersList.js

import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

function TrainersList() {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axiosClient.get('/trainers/');
        setTrainers(response.data);
      } catch (err) {
        console.error(err);
        setError('Nie udało się pobrać listy trenerów.');
      }
    };
    fetchTrainers();
  }, []);

  return (
    <div>
      <h2>Lista Trenerów</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {trainers.length === 0 ? (
        <p>Brak trenerów.</p>
      ) : (
        <ul>
          {trainers.map(trainer => (
            <li key={trainer.id}>
              <strong>{trainer.user?.username || 'Trener'}</strong>
              <p>Specjalizacja: {trainer.specialization}</p>
              {trainer.photo && (
                <img
                  src={trainer.photo}
                  alt="Trainer"
                  style={{ maxWidth: '100px' }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TrainersList;
