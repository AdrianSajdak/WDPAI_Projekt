import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="home">
      <section className="home__hero surface-card">
        <div className="home__hero-content">
          <span className="chip accent">All-in-one fitness companion</span>
          <h1>Manage your gym life with clarity and confidence.</h1>
          <p>
            Book classes, track memberships, and collaborate with trainers on a
            single, beautifully simple platform designed for busy lifestyles.
          </p>
          <div className="home__cta">
            <Link to="/register" className="btn-primary">
              Create account
            </Link>
            <Link to="/login" className="btn-ghost">
              I already have access
            </Link>
          </div>
        </div>

        <div className="home__stats">
          <div className="home__stat">
            <span className="home__stat-label">Active plans</span>
            <span className="home__stat-value">{plans.length}</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-label">Average duration</span>
            <span className="home__stat-value">
              {plans.length
                ? `${Math.round(
                    plans.reduce(
                      (sum, plan) => sum + (plan.duration_days || 0),
                      0
                    ) / plans.length
                  )} days`
                : '—'}
            </span>
          </div>
        </div>
      </section>

      <section className="home__plans section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Membership plans</h2>
            <p className="section-subtitle">
              Choose a membership that matches your goals. Flexible durations
              and transparent pricing make commitment easy.
            </p>
          </div>
          <Link to="/membership-plans" className="btn-surface">
            Browse all plans
          </Link>
        </div>

        {plans.length === 0 ? (
          <div className="home__empty surface-card">
            <h3>No plans yet</h3>
            <p className="muted-text">
              Administrators can add membership plans from the admin panel.
            </p>
          </div>
        ) : (
          <div className="home__plan-grid grid grid-3">
            {plans.map((plan) => (
              <article key={plan.id} className="home__plan-card surface-card">
                <header>
                  <h3>{plan.name}</h3>
                  <p className="muted-text">{plan.description}</p>
                </header>
                <div className="home__plan-meta">
                  <span className="home__price">{plan.price} PLN</span>
                  <span className="chip">{plan.duration_days} days</span>
                </div>
                <Link to="/membership-plans" className="btn-surface">
                  View details
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
