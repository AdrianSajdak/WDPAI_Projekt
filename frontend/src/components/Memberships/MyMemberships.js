// src/components/Memberships/MyMemberships.js
import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';

function MyMemberships() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMemberships();
    }
  }, [user]);

  const fetchMemberships = async () => {
    try {
      // Teraz backend i tak zwróci tylko aktywne membershipy
      const res = await axiosClient.get('/memberships/');
      setMemberships(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch memberships.');
    }
  };

  const handleEndMembership = async (membershipId) => {
    try {
      await axiosClient.post(`/memberships/${membershipId}/end/`);
      // Po zakończeniu membership zniknie z get_queryset (bo nieaktywny)
      fetchMemberships();
    } catch (err) {
      console.error(err);
      setError('Error ending membership.');
    }
  };

  if (!user) return <p>Loading...</p>;
  if (user.is_trainer && !user.is_superuser) {
    // Może tak:
    return (
      <div>
        <h2>My Memberships</h2>
        <p>You are a trainer with unlimited membership, not shown here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>My Memberships</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {memberships.length === 0 ? (
        <p>No active memberships.</p>
      ) : (
        <ul>
          {memberships.map(m => (
            <li key={m.id} style={{ marginBottom: '1rem' }}>
              <strong>Membership ID: {m.id}</strong><br/>
              Plan: {m.plan} <br />
              From: {m.start_date} – To: {m.end_date || 'None'} 
              <br />
              {/* is_active z serializera - tu prawie zawsze true,
                bo get_queryset filtruje, ale zostawmy. */}
              <span style={{ color: 'green' }}>Active</span>
              <br />
              <button onClick={() => handleEndMembership(m.id)}>
                End Membership
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyMemberships;
