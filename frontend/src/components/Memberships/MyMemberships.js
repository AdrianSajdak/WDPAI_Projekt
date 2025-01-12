// src/components/Memberships/MyMemberships.js

import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import '../styles/App.css';

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
        setError('Nie udało się pobrać Twoich członkostw.');
      }
    };
    fetchMemberships();
  }, []);

  return (
    <div>
      <h2>Moje członkostwa</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {myMemberships.length === 0 ? (
        <p>Brak członkostw.</p>
      ) : (
        <ul>
          {myMemberships.map((m) => (
            <li key={m.id}>
              <strong>Plan:</strong> {m.plan} {/* lub m.plan.name */}
              <p>Od: {m.start_date} &nbsp;|&nbsp; Do: {m.end_date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyMemberships;
