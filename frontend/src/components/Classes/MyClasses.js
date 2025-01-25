// src/components/Classes/MyClasses.js
import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';

function MyClasses() {
  const { user } = useAuth();
  const [myClasses, setMyClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyClasses();
    }
  }, [user]);

  const fetchMyClasses = async () => {
    try {
      // backend zwróci TYLKO przyszłe klasy, w których user jest attendees/trainer
      const res = await axiosClient.get('/classes/');
      setMyClasses(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch your classes.');
    }
  };

  const handleLeave = async (classId) => {
    try {
      await axiosClient.post(`/classes/${classId}/leave/`);
      fetchMyClasses();
    } catch (err) {
      alert(err?.response?.data?.detail || 'Error leaving class.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>My Upcoming Classes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {myClasses.length === 0 ? (
        <p>You have no upcoming classes.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {myClasses.map(gc => (
            <li key={gc.id} style={{ margin: '1rem 0' }}>
              <strong>{gc.name}</strong>
              <br />
              Trainer: {gc.trainer_name}
              <br />
              {gc.date_local}
              <br />
              Capacity: {gc.capacity}
              <br />
              {gc.attendees.includes(user.id) && (
                <button onClick={() => handleLeave(gc.id)}>Leave</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyClasses;
