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
      if (!user) return;
      const filtered = res.data.filter((cls) =>
        cls.attendees.includes(user.id)
      );
      setMyClasses(filtered);
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
          {myClasses.map((c) => (
            <li key={c.id} style={{ margin: '1rem 0' }}>
              <strong>{c.name}</strong> ({c.class_type})<br />
              {c.start_time} – {c.end_time}
              <br />
              <button onClick={() => handleLeave(c.id)}>Leave</button>
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
