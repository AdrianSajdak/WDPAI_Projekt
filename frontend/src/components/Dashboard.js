import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [myMemberships, setMyMemberships] = useState([]);
  const [myClasses, setMyClasses] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchMyMemberships = async () => {
      try {
        const res = await axiosClient.get('/memberships/');
        setMyMemberships(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMyClasses = async () => {
      try {
        const res = await axiosClient.get('/classes/');
        const userClasses = res.data.filter((c) => c.attendees.includes(user.id));
        setMyClasses(userClasses);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAll = async () => {
      await Promise.all([fetchMyMemberships(), fetchMyClasses()]);
    };

    fetchAll();
  }, [user]);

  if (!user) {
    return <p className="muted-text">Loading user details…</p>;
  }

  const activeMemberships = myMemberships.filter((m) => m.is_active);

  return (
    <div className="page section dashboard">
      <div className="section-header page-header">
        <div>
          <h2 className="section-title">Welcome back, {user.username}</h2>
          <p className="section-subtitle">
            Track your upcoming classes and current memberships at a glance.
          </p>
        </div>
        <Link to="/all-classes" className="btn-primary">
          Explore classes
        </Link>
      </div>

      <div className="dashboard-metrics">
        <div className="metric-card">
          <span>Active memberships</span>
          <strong>{activeMemberships.length}</strong>
        </div>
        <div className="metric-card">
          <span>Upcoming classes</span>
          <strong>{myClasses.length}</strong>
        </div>
      </div>

      <div className="page-columns">
        <section className="surface-card">
          <div className="section-header" style={{ marginBottom: '1.2rem' }}>
            <div>
              <h3 className="section-title" style={{ fontSize: '1.45rem' }}>
                My memberships
              </h3>
              <p className="muted-text">
                Renew or extend plans from the membership page.
              </p>
            </div>
          </div>

          {myMemberships.length === 0 ? (
            <div className="empty-state">
              <h3>No memberships yet</h3>
              <p className="muted-text">
                Activate your first plan to unlock classes and trainer support.
              </p>
              <Link to="/membership-plans" className="btn-primary" style={{ marginTop: '1rem' }}>
                Browse plans
              </Link>
            </div>
          ) : (
            <ul className="list-plain">
              {myMemberships.map((m) => (
                <li className="list-item" key={m.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <h4>{m.plan_name}</h4>
                    <span className={`status-pill ${m.is_active ? 'success' : 'danger'}`}>
                      {m.is_active ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <div className="muted-text" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <span>
                      <strong>Start:</strong> {m.start_date}
                    </span>
                    <span>
                      <strong>End:</strong> {m.end_date || 'No end date'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface-card">
          <div className="section-header" style={{ marginBottom: '1.2rem' }}>
            <div>
              <h3 className="section-title" style={{ fontSize: '1.45rem' }}>
                My upcoming classes
              </h3>
              <p className="muted-text">
                Manage your attendance and stay on top of your training schedule.
              </p>
            </div>
          </div>

          {myClasses.length === 0 ? (
            <div className="empty-state">
              <h3>No classes booked</h3>
              <p className="muted-text">
                Reserve a spot in group classes to keep your progress moving.
              </p>
            </div>
          ) : (
            <ul className="list-plain">
              {myClasses.map((gc) => (
                <li className="list-item" key={gc.id}>
                  <h4>{gc.name}</h4>
                  <div className="muted-text" style={{ display: 'grid', gap: '0.35rem' }}>
                    <span>Trainer: {gc.trainer_name}</span>
                    <span>Date: {gc.date_local}</span>
                    <span>Capacity: {gc.capacity}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
