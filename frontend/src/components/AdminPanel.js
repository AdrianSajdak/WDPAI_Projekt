import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

function AdminPanel() {
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [groupClasses, setGroupClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);

  // Dane do tworzenia nowego planu członkostwa
  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: '',
  });

  // Dane do tworzenia nowego trenera (z obsługą zdjęcia)
  const [trainerData, setTrainerData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    specialization: '',
    photo: null, // <-- dodajemy pole na plik
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

      const mRes = await axiosClient.get('/memberships/'); // jako admin, widzi wszystkie
      setMemberships(mRes.data);

      setTrainers(tRes.data);
      setPlans(pRes.data);
      setGroupClasses(cRes.data);
      setUsers(uRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Tworzenie nowego planu
  const addMembershipPlan = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/membership-plans/', planData);
      alert('Membership plan created successfully!');
      setPlanData({
        name: '',
        description: '',
        price: '',
        duration_days: '',
      });
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

  // Tworzenie nowego trenera
  const addTrainer = async (e) => {
    e.preventDefault();

    try {
      // Tworzymy FormData, żeby wysłać ewentualne zdjęcie
      const formData = new FormData();
      formData.append('first_name', trainerData.first_name);
      formData.append('last_name', trainerData.last_name);
      formData.append('email', trainerData.email);
      formData.append('password', trainerData.password);
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
      setTrainerData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        specialization: '',
        photo: null,
      });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Error creating trainer.');
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
  
  // Obsługa zmian w formularzu trenera
  const handleTrainerChange = (e) => {
    const { name, value, files } = e.target;
    // Jeśli pole to "photo", wówczas bierzemy plik z e.target.files[0]
    if (name === 'photo') {
      setTrainerData((prev) => ({
        ...prev,
        photo: files[0],
      }));
    } else {
      setTrainerData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  function deleteClass(classId) {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    axiosClient.delete(`/classes/${classId}/`)
      .then(() => {
        alert("Class deleted!");
        fetchAll();  // reload
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
    <div style={{ textAlign: 'center' }}>
      <h2>Admin Panel</h2>

      {/* Sekcja do tworzenia NOWEGO PLANU */}
      <section style={{ margin: '2rem 0' }}>
        <h3>Create Membership Plan</h3>
        <form
          onSubmit={addMembershipPlan}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.5rem',
            margin: '0 auto',
          }}
        >
          <label>
            Plan Name:
            <br />
            <input
              type="text"
              name="name"
              value={planData.name}
              onChange={handlePlanChange}
              required
            />
          </label>

          <label>
            Description:
            <br />
            <textarea
              name="description"
              value={planData.description}
              onChange={handlePlanChange}
              rows={3}
            />
          </label>

          <label>
            Price:
            <br />
            <input
              type="number"
              step="0.01"
              name="price"
              value={planData.price}
              onChange={handlePlanChange}
              required
            />
          </label>

          <label>
            Duration (days):
            <br />
            <input
              type="number"
              name="duration_days"
              value={planData.duration_days}
              onChange={handlePlanChange}
              required
            />
          </label>

          <button type="submit" className="btn-green" style={{ marginTop: '1rem' }}>
            Add Plan
          </button>
        </form>
      </section>

      {/* Sekcja do tworzenia NOWEGO TRENERA */}
      <section style={{ margin: '2rem 0' }}>
        <h3>Create Trainer</h3>
        <form
          onSubmit={addTrainer}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.5rem',
            margin: '0 auto',
          }}
        >
          <label>
            First Name:
            <br />
            <input
              type="text"
              name="first_name"
              value={trainerData.first_name}
              onChange={handleTrainerChange}
              required
            />
          </label>

          <label>
            Last Name:
            <br />
            <input
              type="text"
              name="last_name"
              value={trainerData.last_name}
              onChange={handleTrainerChange}
              required
            />
          </label>

          <label>
            Email:
            <br />
            <input
              type="email"
              name="email"
              value={trainerData.email}
              onChange={handleTrainerChange}
              required
            />
          </label>

          <label>
            Password (optional):
            <br />
            <input
              type="password"
              name="password"
              value={trainerData.password}
              onChange={handleTrainerChange}
            />
          </label>

          <label>
            Specialization:
            <br />
            <input
              type="text"
              name="specialization"
              value={trainerData.specialization}
              onChange={handleTrainerChange}
            />
          </label>

          <label>
            Photo (optional):
            <br />
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleTrainerChange}
            />
          </label>

          <button type="submit" className="btn-green" style={{ marginTop: '1rem' }}>
            Add Trainer
          </button>
        </form>
      </section>

      {/* Sekcja: Existing Trainers */}
      <section>
        <h3>Existing Trainers</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
    {trainers.map((tr) => (
      <li key={tr.id} style={{ marginBottom: '1rem' }}>
        <strong>
          {tr.first_name} {tr.last_name}
        </strong>{' '}
        <br />
        Email: {tr.email} <br />
        Specialization: {tr.specialization || 'N/A'} <br />
        {tr.photo && (
          <img
            src={tr.photo}
            alt="Trainer Photo"
            style={{ width: '100px', height: 'auto' }}
          />
        )}
        <button onClick={() => deleteTrainer(tr.id)}>Delete</button>
      </li>
    ))}
  </ul>
        </section>
{/* Membership Plans (lista) */}
<section>
  <h3>Membership Plans</h3>
  <ul style={{ listStyle: 'none' }}>
    {plans.map((pl) => (
      <li key={pl.id} style={{ marginBottom: '1rem' }}>
        <strong>{pl.name}</strong> – {pl.price} PLN ({pl.duration_days} days)
        <br />
        {pl.description}
        <br />
        <button onClick={() => deletePlan(pl.id)}>Delete</button>
      </li>
    ))}
  </ul>
</section>

{/* All Classes */}
<section>
  <h3>All Classes</h3>
  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
    {groupClasses.map((gc) => (
      <li key={gc.id} style={{ marginBottom: '1rem' }}>
        <strong>{gc.name}</strong>
        <br />
        Trainer: {gc.trainer_name}
        <br />
        {gc.start_local} – {gc.end_local}
        <br />
        Capacity: {gc.capacity}
        <br />
        {/* Przycisk "Delete" (tylko admin) */}
        <button onClick={() => deleteClass(gc.id)}>Delete Class</button>
      </li>
    ))}
  </ul>
</section>

    </div>
  );
}

export default AdminPanel;
