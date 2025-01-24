import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  // Stan do przechowywania ID wybranego planu i niestandardowej daty startu
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [startDate, setStartDate] = useState('');

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

  /**
   * Użytkownik klika "Select" przy planie -> pokazujemy input daty
   */
  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    // Resetujemy ewentualny poprzedni start date
    setStartDate('');
  };

  /**
   * Użytkownik potwierdza zakup planu -> startDate jest brany z inputu
   */
  const handlePurchase = async (planId) => {
    try {
      if (!startDate) {
        alert('Please select a start date!');
        return;
      }
      // Wyszukaj plan w tablicy 'plans'
      const plan = plans.find((p) => p.id === planId);
      if (!plan) {
        alert('Plan not found');
        return;
      }

      // Z endDate obliczamy: startDate + plan.duration_days
      // (YYYY-MM-DD => obiekt Date => +durationDays => new YYYY-MM-DD)
      const sDateObj = new Date(startDate);
      sDateObj.setDate(sDateObj.getDate() + plan.duration_days);
      const endDate = sDateObj.toISOString().split('T')[0];

      await axiosClient.post('/memberships/', {
        plan: planId,
        start_date: startDate,
        end_date: endDate,
      });

      alert('Membership purchased successfully!');
      // Reset
      setSelectedPlanId(null);
      setStartDate('');
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
        <div className="plans-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <div key={plan.id} className="plan-card" style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                margin: '1rem',
                width: '220px',
                textAlign: 'left'
              }}>
                <h3>{plan.name}</h3>
                <p><strong>Price:</strong> {plan.price} PLN</p>
                <p><strong>Duration:</strong> {plan.duration_days} days</p>
                <p style={{ fontStyle: 'italic' }}>{plan.description || 'No description'}</p>

                {!isSelected ? (
                  // Jeśli plan NIE jest aktualnie wybrany -> "Select" button
                  <button onClick={() => handleSelectPlan(plan.id)}>Select</button>
                ) : (
                  // Jeśli plan jest wybrany -> pokazujemy input "start date" + "Confirm Purchase"
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
                    <button style={{ marginTop: '0.5rem' }} onClick={() => handlePurchase(plan.id)}>
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
