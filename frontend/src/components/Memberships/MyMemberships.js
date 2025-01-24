import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import '../../styles/App.css';

function MyMemberships() {
  const [myMemberships, setMyMemberships] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await axiosClient.get('/memberships/');
        setMyMemberships(response.data);
      } catch (err) {
        console.error(err);
        setError('Could not fetch your memberships.');
      }
    };
    if (user && !user.is_trainer) {
      fetchMemberships();
    }
  }, []);

  if (user.is_trainer) {
    // Tylko tekst
    return (
      <div>
        <h2>My Memberships</h2>
        <p>Trainer Membership</p>
      </div>
    );
  }

  return (
    <div>
      <h2>My Memberships</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {myMemberships.length === 0 ? (
        <p>You have no memberships.</p>
      ) : (
        <ul>
          {myMemberships.map((m) => (
            <li key={m.id}>
              {/* If your backend returns nested plan objects, use m.plan.name */}
              <strong>Plan ID:</strong> {m.plan}
              <p>
                From: {m.start_date} &nbsp;|&nbsp; To: {m.end_date}
              </p>
              <p>
                {m.is_active ? (
                  <span style={{ color: 'green' }}>Active</span>
                ) : (
                  <span style={{ color: 'red' }}>Inactive</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyMemberships;
