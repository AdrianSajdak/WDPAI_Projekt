import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

function Home() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      // GET /membership-plans/ (nie wymaga zalogowania, jeśli tak skonfigurowałeś)
      const res = await axiosClient.get('/membership-plans/');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Witaj w GymManagement!</h1>
      <p>Platforma do zarządzania siłownią i zajęciami grupowymi.</p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Dostępne plany członkowskie</h2>
        {plans.length === 0 ? (
          <p>Brak planów.</p>
        ) : (
          <ul>
            {plans.map(p => (
              <li key={p.id}>
                <strong>{p.name}</strong> - {p.price} PLN (ważne {p.duration_days} dni)
                <br />
                {p.description}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Home;