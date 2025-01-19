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
        setError('Could not fetch trainers.');
      }
    };
    fetchTrainers();
  }, []);

  return (
    <div>
      <h2>Trainers List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {trainers.length === 0 ? (
        <p>No trainers available.</p>
      ) : (
        <ul>
          {trainers.map((trainer) => (
            <li key={trainer.id}>
              <strong>{trainer.user?.username || 'Trainer'}</strong>
              <p>Specialization: {trainer.specialization || '—'}</p>
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
