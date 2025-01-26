import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import '../styles/Home.css';

function Home() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axiosClient.get('/membership-plans/');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
      <img src={require('../images/logo.png')} alt="logo"></img>
        <h1 className="home-title">Welcome to GymManagement!</h1>
        <p className="home-subtitle">
          The platform for managing gym memberships and group classes.
        </p>

        <section>
          <h2>Available Membership Plans</h2>
          {plans.length === 0 ? (
            <p>No plans available.</p>
          ) : (
            <ul>
              {plans.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> – {p.price} PLN (
                  {p.duration_days} days)
                  <br />
                  {p.description}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Home;
