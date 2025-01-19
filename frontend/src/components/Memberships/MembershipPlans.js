import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';

/**
 * Renders a list of membership plans.
 * Allows the user to purchase one by clicking a "Buy" button.
 */
function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  // 1. Fetch the membership plans
  const fetchPlans = async () => {
    try {
      const response = await axiosClient.get('/membership-plans/');
      setPlans(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch membership plans.');
    }
  };

  // 2. "Buy" the plan: create a new membership for the logged-in user
  const handlePurchase = async (planId) => {
    try {
      // The start_date (today) can be handled in the backend or here:
      const startDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
      // If your backend auto-calculates end_date, you can skip these lines
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
        <ul style={{ listStyle: 'none', paddingLeft: 0, margin: '1rem' }}>
          {plans.map((plan) => (
            <li
              key={plan.id}
              style={{
                marginBottom: '1rem',
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '4px',
              }}
            >
              <strong>{plan.name}</strong> - {plan.price} PLN 
              <br />
              Duration: {plan.duration_days} days
              <br />
              Description: {plan.description || 'No description'}
              <br />
              <button onClick={() => handlePurchase(plan.id)}>
                Buy
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MembershipPlans;
