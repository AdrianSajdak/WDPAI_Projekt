// src/components/AdminPanel.js

import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import '../styles/Home.css';
import '../styles/AdminPanel.css'

function AdminPanel() {
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [groupClasses, setGroupClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);

  // Dane do tworzenia nowego planu
  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: '',
  });

  // Dane do tworzenia trenera (wybieramy istniejącego usera)
  const [trainerData, setTrainerData] = useState({
    user_id: '',        // <-- klucz
    specialization: '',
    photo: null,
  });

  // Wszystkich userów (do selecta)
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
      const mRes = await axiosClient.get('/memberships/'); // admin - widzi wszystkie

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

  // Tworzenie MembershipPlan
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

  // Tworzenie trenera
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

  // Usuwanie trenera
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

  // Usuwanie klasy
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

  // Usuwanie planu
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
    <div className="admin-container">
      <div className='admin-box'>
        <h2>Admin Panel</h2>
        {/* Sekcja tworzenia MembershipPlan */}
        <div>
          <h3>Create Membership Plan</h3>
          <form onSubmit={addMembershipPlan}>
            <div className="input-group">
              Plan Name:
              <input
                type="text"
                name="name"
                value={planData.name}
                onChange={handlePlanChange}
                required
              />
            </div>

            <div className='input-group'>
              Description:
              <input
                type="text"
                name="description"
                value={planData.description}
                onChange={handlePlanChange}
              />
            </div>
            <div className='input-group'>
              Price (monthly):
              <input
                type="number"
                step="0.01"
                name="price"
                value={planData.price}
                onChange={handlePlanChange}
                required
              />
            </div>
            <div className='input-group'>
              Duration (days):
              <input
                type="number"
                name="duration_days"
                value={planData.duration_days}
                onChange={handlePlanChange}
              />
            </div>
            <button type="submit" className="btn-green">
              Add Plan
            </button>
          </form>
        </div>

        {/* Sekcja do tworzenia NOWEGO TRENERA */}
        <div>
          <h3>Create Trainer</h3>
          <form
            onSubmit={addTrainer}
          >
            <div className='input-group'>
              Select existing user:
              <select
                id="user_id"
                name="user_id"
                value={trainerData.user_id}
                onChange={handleTrainerChange}
                required
              >
                <option value="">-- select user --</option>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <div className='input-group'>
              Specialization:
              <input
                type="text"
                name="specialization"
                value={trainerData.specialization}
                onChange={handleTrainerChange}
              />
            </div>
            <div className='input-group'>
              Photo (optional):
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleTrainerChange}
              />
            </div>
            <button type="submit" className="btn-green">
              Add Trainer
            </button>
          </form>
        </div>
        {/* Lista istniejących trenerów */}
        <div>
          <h3>Existing Trainers</h3>
          <ul>
            {trainers.map((tr) => (
              <li key={tr.id}>
                <strong>
                  {tr.first_name} {tr.last_name}
                </strong>
                <br />
                Specialization: {tr.specialization || 'N/A'}
                <br />
                {tr.photo && (
                  <img
                    src={tr.photo}
                    alt="Trainer Photo"
                    style={{ width: '100px', height: 'auto' }}
                  />
                )}
                <br />
                <button onClick={() => deleteTrainer(tr.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>


        {/* Membership Plans (lista) */}
        <div>
          <h3>Membership Plans</h3>
          <ul>
            {plans.map((pl) => (
              <li key={pl.id}>
                <strong>{pl.name}</strong> – {pl.price} PLN
                <br />
                {pl.description}
                <br />
                <button onClick={() => deletePlan(pl.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        {/* All Classes */}
        <div>
          <h3>All Classes</h3>
          <ul>
            {groupClasses.map((gc) => (
              <li key={gc.id}>
                <strong>{gc.name}</strong>
                <br />
                Trainer: {gc.trainer_name}
                <br />
                Date: {gc.date_local}
                <br />
                Capacity: {gc.capacity}
                <br />
                <button onClick={() => deleteClass(gc.id)}>Delete Class</button>
              </li>
            ))}
          </ul>
        </div>

      </div >
    </div >




  );
}

export default AdminPanel;
