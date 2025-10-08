import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';
import '../../styles/Memberships.css';

function MembershipPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  const [activeMembership, setActiveMembership] = useState(null);

  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [months, setMonths] = useState(1);

  useEffect(() => {
    if (!user) return;
    fetchActiveMembership();
  }, [user]);

  useEffect(() => {
    if (user && !activeMembership) {
      fetchPlans();
    }
  }, [user, activeMembership]);

  const fetchActiveMembership = async () => {
    try {
      const res = await axiosClient.get('/memberships/');

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

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    setStartDate('');
    setMonths(1);
  };

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
      fetchActiveMembership();

      setSelectedPlanId(null);
      setStartDate('');
      setMonths(1);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data) {
        const msg = Object.values(err.response.data).join(' ');
        setError(msg || 'Error purchasing membership plan.');
      } else {
        setError('Error purchasing membership plan.');
      }
    }
  };

  const handleEndMembership = async (membershipId) => {
    try {
      await axiosClient.post(`/memberships/${membershipId}/end/`);
      alert('Membership ended.');
      fetchActiveMembership();
    } catch (err) {
      console.error(err);
      setError('Error ending membership.');
    }
  };

  if (!user) {
    return <p className="muted-text">Loading user data…</p>;
  }

  return (
    <div className="page section memberships-page">
      <div className="section-header page-header">
        <div>
          <span className="chip accent">Memberships</span>
          <h2 className="section-title">Choose the plan that matches your goals</h2>
          <p className="section-subtitle">
            Manage your active subscription or upgrade to unlock more classes and trainer time.
          </p>
        </div>
      </div>

      {error && <p className="auth-error" style={{ maxWidth: '480px' }}>{error}</p>}

      {activeMembership ? (
        <section className="surface-card membership-active">
          <header>
            <h3>Active membership</h3>
            <span className="status-pill success">Active</span>
          </header>
          <div className="muted-text" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <span>
              <strong>Plan:</strong> {activeMembership.plan}
            </span>
            <span>
              <strong>Start:</strong> {activeMembership.start_date}
            </span>
            <span>
              <strong>End:</strong> {activeMembership.end_date || 'No end date'}
            </span>
          </div>
          <p className="muted-text">You can end your current membership early if you need to switch plans.</p>
          <div className="form-actions">
            <button
              type="button"
              className="btn-danger"
              onClick={() => handleEndMembership(activeMembership.id)}
            >
              End membership
            </button>
          </div>
        </section>
      ) : (
        <section className="surface-card plan-selector">
          <h3 style={{ marginTop: 0 }}>Available plans</h3>
          {plans.length === 0 ? (
            <div className="empty-state" style={{ marginTop: '1.5rem' }}>
              <h3>No plans available</h3>
              <p className="muted-text">Reach out to an administrator to configure membership plans.</p>
            </div>
          ) : (
            <div className="plans-grid" style={{ marginTop: '1.5rem' }}>
              {plans.map((plan) => {
                const isSelected = plan.id === selectedPlanId;

                return (
                  <article key={plan.id} className="surface-card plan-card" style={{ boxShadow: 'var(--shadow-border)' }}>
                    <div>
                      <h3>{plan.name}</h3>
                      <p className="muted-text">{plan.description || 'No description provided.'}</p>
                    </div>
                    <div className="plan-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                      <span className="plan-price">{plan.price} PLN</span>
                      <span className="chip">{plan.duration_days} days</span>
                    </div>

                    {!isSelected ? (
                      <button type="button" className="btn-surface" onClick={() => handleSelectPlan(plan.id)}>
                        Select plan
                      </button>
                    ) : (
                      <div className="plan-select">
                        <div className="form-field">
                          <label htmlFor="start-date">Start date</label>
                          <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="plan-months">Number of months</label>
                          <select
                            id="plan-months"
                            value={months}
                            onChange={(e) => setMonths(Number(e.target.value))}
                          >
                            {[1, 2, 3, 6, 12].map((m) => (
                              <option key={m} value={m}>
                                {m} {m === 1 ? 'month' : 'months'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-actions">
                          <button type="button" className="btn-primary" onClick={() => handlePurchase(plan.id)}>
                            Confirm purchase
                          </button>
                          <button type="button" className="btn-ghost" onClick={() => setSelectedPlanId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default MembershipPlans;
