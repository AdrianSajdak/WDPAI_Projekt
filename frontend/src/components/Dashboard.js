import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Login.css'


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
    <div>
      <h2>User Dashboard</h2>
      {user ? (
        <>
          <p>Hello, {user.username}!</p>

          <section>
            <h3>My Memberships</h3>
            {myMemberships.length === 0 ? (
              <p>No memberships.</p>
            ) : (
              <ul>
                {myMemberships.map((m) => (
                  <li key={m.id} >
                    <strong>Plan:</strong> {m.plan_name} <br />
                    <strong>From:</strong> {m.start_date} - <strong>To:</strong> {m.end_date}                    
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

          <section>
  <h3>My Classes</h3>
  {myClasses.length === 0 ? (
    <p>You are not enrolled in any classes.</p>
  ) : (
    <ul>
      {myClasses.map((gc) => (
        <li key={gc.id}>
          <strong>{gc.name}</strong>
          <br />
          Trainer: {gc.trainer_name}       {/* <-- z serializer */}
          <br />
          Date: {gc.date_local}           {/* <-- z serializer */}
          <br />
          Capacity: {gc.capacity}
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
