import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';

function MyClasses() {
  const { user } = useAuth();
  const [myClasses, setMyClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      const res = await axiosClient.get('/classes/');
      const joined = res.data.filter(gc => gc.attendees.includes(user.id));
      setMyClasses(joined);
    } catch (err) {
      console.error(err);
      setError('Could not fetch your classes.');
    }
  };

  const handleLeave = async (classId) => {
    try {
      await axiosClient.post(`/classes/${classId}/leave/`);
      alert('Left the class!');
      fetchMyClasses();
    } catch (err) {
      alert(err?.response?.data?.detail || 'Error leaving class.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>My Classes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {myClasses.length === 0 ? (
        <p>You have no enrolled classes.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {myClasses.map((gc) => (
            <li key={gc.id} style={{ margin: '1rem 0' }}>
              <strong>{gc.name}</strong>
              <br />
              Trainer: {gc.trainer_name}
              <br />
              {gc.start_local} – {gc.end_local}
              <br />
              Capacity: {gc.capacity}
              <button onClick={() => handleLeave(gc.id)}>Leave</button>
            </li>
          ))}
        </ul>
      )}
      <br />
      <a href="/dashboard" className="btn">
        Back to Dashboard
      </a>
    </div>
  );
}

export default MyClasses;
