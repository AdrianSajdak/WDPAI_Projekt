import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

function AdminPanel() {
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [groupClasses, setGroupClasses] = useState([]);
  const [users, setUsers] = useState([]);

  const [membershipData, setMembershipData] = useState({
    user: '',
    plan: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const tRes = await axiosClient.get('/trainers/');
      const pRes = await axiosClient.get('/membership-plans/');
      const cRes = await axiosClient.get('/classes/');
      const uRes = await axiosClient.get('/users/');
      setTrainers(tRes.data);
      setPlans(pRes.data);
      setGroupClasses(cRes.data);
      setUsers(uRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addMembership = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/memberships/', membershipData);
      alert('Membership created successfully!');
      setMembershipData({
        user: '',
        plan: '',
        start_date: '',
        end_date: '',
      });
    } catch (err) {
      console.error(err);
      alert('Error creating membership.');
    }
  };

  const handleMembershipChange = (e) => {
    setMembershipData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Admin Panel</h2>

      <section style={{ margin: '2rem 0' }}>
        <h3>Create Membership</h3>
        <form
          onSubmit={addMembership}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.5rem',
            margin: '0 auto',
          }}
        >
          <label>
            User:
            <br />
            <select
              name="user"
              value={membershipData.user}
              onChange={handleMembershipChange}
              required
            >
              <option value="">-- choose user --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          </label>

          <label>
            Plan:
            <br />
            <select
              name="plan"
              value={membershipData.plan}
              onChange={handleMembershipChange}
              required
            >
              <option value="">-- choose plan --</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.price} PLN / {p.duration_days} days)
                </option>
              ))}
            </select>
          </label>

          <label>
            Start Date:
            <br />
            <input
              type="date"
              name="start_date"
              value={membershipData.start_date}
              onChange={handleMembershipChange}
              required
            />
          </label>

          <label>
            End Date:
            <br />
            <input
              type="date"
              name="end_date"
              value={membershipData.end_date}
              onChange={handleMembershipChange}
              required
            />
          </label>

          <button type="submit" className="btn-green" style={{ marginTop: '1rem' }}>
            Add Membership
          </button>
        </form>
      </section>

      <section>
        <h3>Existing Trainers</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {trainers.map((tr) => (
            <li key={tr.id}>
              {tr.user?.username} – {tr.specialization}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Membership Plans</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {plans.map((pl) => (
            <li key={pl.id}>
              {pl.name} – {pl.price} PLN ({pl.duration_days} days)
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>All Classes</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {groupClasses.map((gc) => (
            <li key={gc.id}>
              {gc.name} (Trainer ID: {gc.trainer})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminPanel;
