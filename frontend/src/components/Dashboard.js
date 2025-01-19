import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';


function Dashboard() {
  const { user } = useAuth();
  const [myMemberships, setMyMemberships] = useState([]);
  const [myClasses, setMyClasses] = useState([]);

  useEffect(() => {
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
        if (!user) return;
        const userClasses = res.data.filter((c) =>
          c.attendees.includes(user.id)
        );
        setMyClasses(userClasses);
      } catch (err) {
        console.error(err);
      }
    };
  
    const fetchAll = async () => {
      await fetchMyMemberships();
      await fetchMyClasses();
    };
    fetchAll();
  }, [user]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>User Dashboard</h2>
      {user ? (
        <>
          <p>Hello, {user.username}!</p>

          <section style={{ marginBottom: '2rem' }}>
            <h3>My Memberships</h3>
            {myMemberships.length === 0 ? (
              <p>No memberships.</p>
            ) : (
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {myMemberships.map((m) => (
                  <li key={m.id} style={{ margin: '1rem 0' }}>
                    <strong>Plan:</strong> {m.plan} <br />
                    From: {m.start_date} – To: {m.end_date}{' '}
                    {m.is_active ? (
                      <span style={{ color: 'green' }}>(Active)</span>
                    ) : (
                      <span style={{ color: 'red' }}>(Inactive)</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3>My Classes</h3>
            {myClasses.length === 0 ? (
              <p>You are not enrolled in any classes.</p>
            ) : (
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {myClasses.map((c) => (
                  <li key={c.id} style={{ margin: '1rem 0' }}>
                    <strong>{c.name}</strong> ({c.class_type}) <br />
                    {c.start_time} – {c.end_time}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Link to="/all-classes" className="btn">
            View All Classes
          </Link>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default Dashboard;
