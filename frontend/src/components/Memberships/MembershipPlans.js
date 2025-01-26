// src/components/Memberships/MembershipPlans.js

import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';

function MembershipPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  // Stan do przechowywania "czy user ma aktywny membership"
  const [activeMembership, setActiveMembership] = useState(null);

  // Stan do wybranego planu, startDate i months do kupna
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [months, setMonths] = useState(1);

  useEffect(() => {
    if (!user) return;
    fetchActiveMembership();
  }, [user]);

  // Jeśli user NIE ma aktywnego membership, pobieramy listę planów
  useEffect(() => {
    if (user && !activeMembership) {
      fetchPlans();
    }
  }, [user, activeMembership]);

  const fetchActiveMembership = async () => {
    try {
      const res = await axiosClient.get('/memberships/');
      // Szukamy membershipu, który ma is_active = true
      const active = res.data.find((m) => m.is_active === true);
      if (active) {
        setActiveMembership(active);
      } else {
        setActiveMembership(null);
      }
    } catch (err) {
      console.error(err);
      setError('Could not fetch memberships.');
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await axiosClient.get('/membership-plans/');
      setPlans(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch membership plans.');
    }
  };

  // Gdy user klika w "Select" plan
  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    setStartDate('');
    setMonths(1);
  };

  // Gdy user potwierdza kupno planu
  const handlePurchase = async (planId) => {
    try {
      if (!startDate) {
        alert('Please select a start date!');
        return;
      }
      const totalDays = 30 * months;
      const sDateObj = new Date(startDate);
      sDateObj.setDate(sDateObj.getDate() + totalDays);
      const endDate = sDateObj.toISOString().split('T')[0];

      await axiosClient.post('/memberships/', {
        plan: planId,
        start_date: startDate,
        end_date: endDate,
      });

      alert('Membership purchased successfully!');
      // Po kupnie odświeżamy membership
      fetchActiveMembership();
      // Reset
      setSelectedPlanId(null);
      setStartDate('');
      setMonths(1);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data) {
        // Może ValidationError w formie dict
        const msg = Object.values(err.response.data).join(' ');
        setError(msg || 'Error purchasing membership plan.');
      } else {
        setError('Error purchasing membership plan.');
      }
    }
  };

  // Kończenie aktywnego membership
  const handleEndMembership = async (membershipId) => {
    try {
      await axiosClient.post(`/memberships/${membershipId}/end/`);
      alert('Membership ended.');
      // Re-fetch, żeby odświeżyć stan:
      fetchActiveMembership();
    } catch (err) {
      console.error(err);
      setError('Error ending membership.');
    }
  };

  // Jeśli brak usera => loading
  if (!user) {
    return <p>Loading user...</p>;
  }

  // Jeżeli mamy błąd globalny
  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  // Sprawdzamy, czy user ma aktywne membership
  if (activeMembership) {
    // Wyświetlamy tylko to membership i przycisk end
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Your Active Membership</h2>
        <div style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1rem',
          margin: '1rem auto',
          width: '300px',
          textAlign: 'left'
        }}>
          <p><strong>Membership ID:</strong> {activeMembership.id}</p>
          <p><strong>Plan:</strong> {activeMembership.plan}</p>
          <p><strong>Start Date:</strong> {activeMembership.start_date}</p>
          <p><strong>End Date:</strong> {activeMembership.end_date || 'No end date (unlimited)'}</p>
          <p style={{ color: 'green' }}><strong>Active</strong></p>
          <button onClick={() => handleEndMembership(activeMembership.id)}>
            End Membership
          </button>
        </div>
      </div>
    );
  }

  // W przeciwnym razie user nie ma aktywnego membership => wyświetlamy listę planów
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Available Membership Plans</h2>
      {plans.length === 0 ? (
        <p>No membership plans found.</p>
      ) : (
        <div
          className="plans-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <div
                key={plan.id}
                className="plan-card"
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '1rem',
                  margin: '1rem',
                  width: '220px',
                  textAlign: 'left'
                }}
              >
                <h3>{plan.name}</h3>
                <p>
                  <strong>Price:</strong> {plan.price} PLN
                </p>
                <p style={{ fontStyle: 'italic' }}>
                  {plan.description || 'No description'}
                </p>

                {!isSelected ? (
                  <button onClick={() => handleSelectPlan(plan.id)}>Select</button>
                ) : (
                  <div style={{ marginTop: '1rem' }}>
                    <label>
                      Start date:
                      <br />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </label>
                    <br />
                    <button
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => handlePurchase(plan.id)}
                    >
                      Confirm Purchase
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MembershipPlans;
