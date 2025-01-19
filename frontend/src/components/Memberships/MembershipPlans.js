import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axiosClient.get('/membership-plans/');
      setPlans(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch membership plans.');
    }
  };

  const handlePurchase = async (planId) => {
    try {
      const startDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const plan = plans.find((p) => p.id === planId);
      let endDate = startDate;
      if (plan) {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + plan.duration_days);
        endDate = dateObj.toISOString().split('T')[0];
      }

      await axiosClient.post('/memberships/', {
        plan: planId,
        start_date: startDate,
        end_date: endDate,
      });

      alert('Membership purchased successfully!');
    } catch (err) {
      console.error(err);
      setError('Error purchasing membership plan.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Available Membership Plans</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {plans.length === 0 ? (
        <p>No membership plans found.</p>
      ) : (
        <ul>
          {plans.map((plan) => (
            <li key={plan.id} style={{ marginBottom: '1rem' }}>
              <strong>{plan.name}</strong> - {plan.price} PLN
              <br />
              Duration: {plan.duration_days} days
              <br />
              {plan.description}
              <br />
              <button onClick={() => handlePurchase(plan.id)}>Buy</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MembershipPlans;
