import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

function AllClasses() {
  const { user } = useAuth();
  const [classesList, setClassesList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axiosClient.get('/classes/');
      setClassesList(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch classes.');
    }
  };

  const handleJoin = async (classId) => {
    try {
      await axiosClient.post(`/classes/${classId}/join/`);
      alert('Joined the class!');
      fetchClasses();
    } catch (err) {
      alert(err?.response?.data?.detail || 'Error joining class.');
    }
  };

  const handleLeave = async (classId) => {
    try {
      await axiosClient.post(`/classes/${classId}/leave/`);
      alert('Left the class!');
      fetchClasses();
    } catch (err) {
      alert(err?.response?.data?.detail || 'Error leaving class.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>All Classes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {classesList.length === 0 ? (
        <p>No classes available.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {classesList.map((gc) => {
            const freeSpots = gc.capacity - (gc.attendees?.length || 0);
            const isJoined = user && gc.attendees?.includes(user.id);

            return (
              <li key={gc.id} style={{ marginBottom: '1rem' }}>
                <strong>{gc.name}</strong>
                <br />
                Trainer: {gc.trainer_name}
                <br />
                Date: {gc.date_local}
                <br />
                Spots: {freeSpots} / {gc.capacity}
                <br />
                {user && !user.is_trainer && (
                  isJoined ? (
                    <button onClick={() => handleLeave(gc.id)}>Leave</button>
                  ) : (
                    <button onClick={() => handleJoin(gc.id)}>Join</button>
                  )
                )}
              </li>
            );
          })}
        </ul>
      )}
      <br />
      <Link to="/dashboard" className="btn">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default AllClasses;
