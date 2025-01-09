// src/components/Memberships/MembershipPlans.js

import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosClient.get('/membership-plans/');
        setPlans(response.data);
      } catch (err) {
        console.error(err);
        setError('Nie udało się pobrać planów członkostwa.');
      }
    };
    fetchPlans();
  }, []);

  const handlePurchase = async (planId) => {
    try {
      // W zależności od backendu – można POST /memberships/ z planId, start_date, end_date
      alert(`Kupiono plan o ID: ${planId}`);
    } catch (err) {
      console.error(err);
      setError('Błąd podczas zakupu planu.');
    }
  };

  return (
    <div>
      <h2>Plany członkostw</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {plans.length === 0 ? (
        <p>Brak planów.</p>
      ) : (
        <ul>
          {plans.map(plan => (
            <li key={plan.id}>
              <strong>{plan.name}</strong> - {plan.price} PLN
              <p>{plan.description}</p>
              <button onClick={() => handlePurchase(plan.id)}>Wykup</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MembershipPlans;
