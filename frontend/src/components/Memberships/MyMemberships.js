import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';
import '../../styles/Home.css';

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
      fetchMemberships();
    } catch (err) {
      console.error(err);
      setError('Error ending membership.');
    }
  };

  if (!user) return <p>Loading...</p>;
  if (user.is_trainer && !user.is_superuser) {
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
              <p><strong>Plan:</strong> {activeMembership.plan_name}</p>
              From: {m.start_date} – To: {m.end_date || 'None'} 
              <br />
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
