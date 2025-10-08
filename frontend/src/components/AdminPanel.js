import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [groupClasses, setGroupClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);

  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: '',
  });

  const [trainerData, setTrainerData] = useState({
    user_id: '',
    specialization: '',
    photo: null,
  });

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchAll();
    fetchAllUsers();
  }, []);

  const fetchAll = async () => {
    try {
      const tRes = await axiosClient.get('/trainers/');
      const pRes = await axiosClient.get('/membership-plans/');
      const cRes = await axiosClient.get('/classes/');
      const uRes = await axiosClient.get('/users/');
      const mRes = await axiosClient.get('/memberships/');

      setTrainers(tRes.data);
      setPlans(pRes.data);
      setGroupClasses(cRes.data);
      setUsers(uRes.data);
      setMemberships(mRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axiosClient.get('/users/');
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addMembershipPlan = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/membership-plans/', {
        name: planData.name,
        description: planData.description,
        price: planData.price,
        duration_days: planData.duration_days,
      });
      alert('Membership plan created successfully!');
      setPlanData({ name: '', description: '', price: '', duration_days: '' });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Error creating membership plan.');
    }
  };

  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlanData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTrainer = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('user_id', trainerData.user_id);
      formData.append('specialization', trainerData.specialization);
      if (trainerData.photo) {
        formData.append('photo', trainerData.photo);
      }

      await axiosClient.post('/trainers/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Trainer created successfully!');
      setTrainerData({ user_id: '', specialization: '', photo: null });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Error creating trainer.');
    }
  };

  const handleTrainerChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setTrainerData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setTrainerData((prev) => ({ ...prev, [name]: value }));
    }
  };

  function deleteTrainer(trainerId) {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
    axiosClient.delete(`/trainers/${trainerId}/`)
      .then(() => {
        alert("Trainer deleted!");
        fetchAll();
      })
      .catch(err => {
        console.error(err);
        alert("Error deleting trainer.");
      });
  }

  function deleteClass(classId) {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    axiosClient.delete(`/classes/${classId}/`)
      .then(() => {
        alert("Class deleted!");
        fetchAll();
      })
      .catch(err => {
        console.error(err);
        alert("Error deleting class.");
      });
  }

  function deletePlan(planId) {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    axiosClient.delete(`/membership-plans/${planId}/`)
      .then(() => {
        alert('Plan deleted!');
        fetchAll();
      })
      .catch(err => {
        console.error(err);
        alert('Error deleting plan.');
      });
  }

  return (
    <div className="page section panel-page">
      <div className="section-header page-header">
        <div>
          <span className="chip accent">Admin tools</span>
          <h2 className="section-title">Gym control center</h2>
          <p className="section-subtitle">
            Manage plans, classes, and trainers with a streamlined workspace.
          </p>
        </div>
      </div>

      <div className="panel-grid">
        <section className="surface-card panel-card">
          <h3>Create membership plan</h3>
          <p className="panel-note">Define pricing and duration to make a new plan available instantly.</p>
          <form onSubmit={addMembershipPlan} className="form-stacked">
            <div className="form-field">
              <label htmlFor="plan-name">Plan name</label>
              <input
                id="plan-name"
                type="text"
                name="name"
                value={planData.name}
                onChange={handlePlanChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="plan-description">Description</label>
              <textarea
                id="plan-description"
                name="description"
                rows={3}
                value={planData.description}
                onChange={handlePlanChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="plan-price">Price (PLN)</label>
              <input
                id="plan-price"
                type="number"
                step="0.01"
                name="price"
                value={planData.price}
                onChange={handlePlanChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="plan-duration">Duration (days)</label>
              <input
                id="plan-duration"
                type="number"
                name="duration_days"
                value={planData.duration_days}
                onChange={handlePlanChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Publish plan
              </button>
            </div>
          </form>
        </section>

        <section className="surface-card panel-card">
          <h3>Register trainer</h3>
          <p className="panel-note">Convert an existing user into a trainer and optionally add a profile photo.</p>
          <form onSubmit={addTrainer} className="form-stacked">
            <div className="form-field">
              <label htmlFor="select-trainer-user">User</label>
              <select
                id="select-trainer-user"
                name="user_id"
                value={trainerData.user_id}
                onChange={handleTrainerChange}
                required
              >
                <option value="">Select user</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="trainer-specialization">Specialization</label>
              <input
                id="trainer-specialization"
                type="text"
                name="specialization"
                value={trainerData.specialization}
                onChange={handleTrainerChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="trainer-photo">Photo</label>
              <input
                id="trainer-photo"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleTrainerChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Add trainer
              </button>
            </div>
          </form>
        </section>
      </div>

      <section className="surface-card panel-card">
        <h3>Existing trainers</h3>
        {trainers.length === 0 ? (
          <div className="empty-state">
            <h3>No trainers yet</h3>
            <p className="muted-text">Create a trainer profile to assign classes and manage schedules.</p>
          </div>
        ) : (
          <div className="panel-list">
            {trainers.map((tr) => (
              <div className="panel-list-item" key={tr.id}>
                <header>
                  <h4>
                    {tr.first_name} {tr.last_name}
                  </h4>
                  <button type="button" className="btn-danger" onClick={() => deleteTrainer(tr.id)}>
                    Remove
                  </button>
                </header>
                <p className="muted-text">{tr.specialization || 'No specialization provided'}</p>
                {tr.photo && (
                  <img
                    src={tr.photo}
                    alt={`${tr.first_name} ${tr.last_name}`}
                    style={{ width: '120px', borderRadius: '12px' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="surface-card panel-card">
        <h3>Membership plans</h3>
        {plans.length === 0 ? (
          <div className="empty-state">
            <h3>No plans published</h3>
            <p className="muted-text">Create your first membership plan to begin onboarding members.</p>
          </div>
        ) : (
          <div className="panel-list">
            {plans.map((pl) => (
              <div className="panel-list-item" key={pl.id}>
                <header>
                  <h4>{pl.name}</h4>
                  <button type="button" className="btn-danger" onClick={() => deletePlan(pl.id)}>
                    Delete
                  </button>
                </header>
                <div className="muted-text" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <span>
                    <strong>Price:</strong> {pl.price} PLN
                  </span>
                  <span>
                    <strong>Duration:</strong> {pl.duration_days} days
                  </span>
                </div>
                <p className="muted-text">{pl.description || 'No description provided.'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="surface-card panel-card">
        <h3>All classes</h3>
        {groupClasses.length === 0 ? (
          <div className="empty-state">
            <h3>No classes available</h3>
            <p className="muted-text">Trainers can create new classes from their panel.</p>
          </div>
        ) : (
          <div className="panel-list">
            {groupClasses.map((gc) => (
              <div className="panel-list-item" key={gc.id}>
                <header>
                  <h4>{gc.name}</h4>
                  <button type="button" className="btn-danger" onClick={() => deleteClass(gc.id)}>
                    Delete class
                  </button>
                </header>
                <div className="muted-text" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <span>Trainer: {gc.trainer_name}</span>
                  <span>Date: {gc.date_local}</span>
                  <span>Capacity: {gc.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminPanel;
