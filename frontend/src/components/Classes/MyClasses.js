import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';
import '../../styles/Classes.css';

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
    <div className="page section classes-page">
      <div className="section-header page-header">
        <div>
          <span className="chip accent">Schedule</span>
          <h2 className="section-title">My upcoming classes</h2>
          <p className="section-subtitle">
            Stay on track with your sessions and adjust attendance when plans change.
          </p>
        </div>
      </div>

      {error && <p className="auth-error" style={{ maxWidth: '520px' }}>{error}</p>}

      {myClasses.length === 0 ? (
        <div className="empty-state">
          <h3>No classes booked</h3>
          <p className="muted-text">Browse the class catalogue to reserve your next training.</p>
        </div>
      ) : (
        <div className="classes-grid">
          {myClasses.map((gc) => (
            <article key={gc.id} className="surface-card class-card">
              <header>
                <h3>{gc.name}</h3>
                <span className="chip">{gc.capacity} spots</span>
              </header>
              <div className="class-meta">
                <span>Trainer: {gc.trainer_name}</span>
                <span>Date: {gc.date_local}</span>
              </div>
              {user && gc.attendees.includes(user.id) && (
                <div className="class-actions">
                  <button type="button" className="btn-ghost" onClick={() => handleLeave(gc.id)}>
                    Cancel reservation
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyClasses;
