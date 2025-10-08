import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import '../../styles/Classes.css';

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
    <div className="page section classes-page">
      <div className="section-header page-header">
        <div>
          <span className="chip accent">Classes</span>
          <h2 className="section-title">Explore group and individual sessions</h2>
          <p className="section-subtitle">
            Reserve your spot and keep expanding your training routine.
          </p>
        </div>
        <Link to="/dashboard" className="btn-ghost">
          Back to dashboard
        </Link>
      </div>

      {error && <p className="auth-error" style={{ maxWidth: '520px' }}>{error}</p>}

      {classesList.length === 0 ? (
        <div className="empty-state">
          <h3>No classes available</h3>
          <p className="muted-text">Trainers are preparing new sessions. Check again soon.</p>
        </div>
      ) : (
        <div className="classes-grid">
          {classesList.map((gc) => {
            const attendeesCount = gc.attendees?.length || 0;
            const freeSpots = Math.max(gc.capacity - attendeesCount, 0);
            const isJoined = user && gc.attendees?.includes(user.id);
            const isFull = freeSpots === 0;

            return (
              <article key={gc.id} className="surface-card class-card">
                <header>
                  <h3>{gc.name}</h3>
                  <span className={`chip ${isFull ? '' : 'accent'}`}>
                    {isFull ? 'Full' : `${freeSpots} spots left`}
                  </span>
                </header>

                <div className="class-meta">
                  <span>Trainer: {gc.trainer_name}</span>
                  <span>Date: {gc.date_local}</span>
                  <span>Capacity: {gc.capacity}</span>
                </div>

                {user && !user.is_trainer && (
                  <div className="class-actions">
                    {isJoined ? (
                      <button type="button" className="btn-ghost" onClick={() => handleLeave(gc.id)}>
                        Leave class
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => handleJoin(gc.id)}
                        disabled={isFull}
                        style={isFull ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
                      >
                        Join class
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllClasses;
