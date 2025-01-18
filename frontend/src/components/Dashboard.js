import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import useAuth from '../hooks/useAuth';
import '../styles/App.css';

function Dashboard() {

  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [myMemberships, setMyMemberships] = useState([]);

  useEffect(() => {
    fetchPlans();
    fetchMyMemberships();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axiosClient.get('/membership-plans/');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyMemberships = async () => {
    try {
      const res = await axiosClient.get('/memberships/');
      setMyMemberships(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) return;

    try {
      // W backendzie w MembershipViewSet: perform_create -> user=request.user
      // W body wystarczy {"plan": <id>, "start_date": ..., "end_date": ...}
      // Albo możemy obliczyć end_date = now + plan.duration_days (opcjonalnie).
      const startDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
      // (opcjonalnie) pobierzmy plan, by obliczyć end_date
      const chosenPlan = plans.find(p => p.id === parseInt(selectedPlanId));
      let endDate = startDate;
      if (chosenPlan) {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + chosenPlan.duration_days);
        endDate = dateObj.toISOString().split('T')[0];
      }

      await axiosClient.post('/memberships/', {
        plan: selectedPlanId,
        start_date: startDate,
        end_date: endDate
      });
      alert('Wykupiono plan członkowski!');
      setSelectedPlanId('');
      fetchMyMemberships();
    } catch (err) {
      console.error(err);
      alert('Błąd przy kupowaniu planu.');
    }
  };

  return (
    <div>
      <h2>Panel użytkownika</h2>
      {user ? (
        <>
          <p>Witaj, {user?.username}!</p>

          <section style={{ marginBottom: '2rem' }}>
            <h3>Wybierz plan członkowski</h3>
            <form onSubmit={handlePurchase} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}>
                <option value="">-- Wybierz plan --</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.price} PLN / {p.duration_days} dni)
                  </option>
                ))}
              </select>
              <button type="submit">Kup plan</button>
            </form>
          </section>

          <section>
            <h3>Moje członkostwa</h3>
            {myMemberships.length === 0 ? (
              <p>Brak aktywnych członkostw.</p>
            ) : (
              <ul>
                {myMemberships.map(m => (
                  <li key={m.id}>
                    Plan ID: {m.plan} | od {m.start_date} do {m.end_date}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <p>Nie jesteś zalogowany.</p>
      )}
    </div>
  );
}

export default Dashboard;




  
