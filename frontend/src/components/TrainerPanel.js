import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import useAuth from '../hooks/useAuth';
import '../styles/TrainerPanel.css';


function TrainerPanel() {
  const { user } = useAuth();
  const [myClasses, setMyClasses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date_time: '',
    capacity: 10,
    class_type: 'group',
    selected_user: '',
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    fetchMyClasses();
  }, [user]);

  const fetchMyClasses = async () => {
    try {
      const res = await axiosClient.get('/classes/');
      if (!user) {
        setMyClasses([]);
        return;
      }
      const trainerClasses = res.data.filter((gc) => gc.trainer === user.id);
      setMyClasses(trainerClasses);
    } catch (err) {
      console.error(err);
      alert('Could not fetch your classes.');
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createClass = async (e) => {
    e.preventDefault();
    try {
      let postData = {
        name: formData.name,
        description: formData.description,
        date_time: formData.date_time,
        class_type: formData.class_type,
      };

      if (formData.class_type === 'group') {
        postData.capacity = Number(formData.capacity);
      } else {
        postData.capacity = 1;
        if (formData.selected_user) {
          postData.attendees = [Number(formData.selected_user)];
        }
      }

      await axiosClient.post('/classes/', postData);
      alert('New class created!');
      resetForm();
      fetchMyClasses();
    } catch (err) {
      console.error(err);
      alert('Error creating class.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date_time: '',
      capacity: 10,
      class_type: 'group',
      selected_user: '',
    });
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await axiosClient.delete(`/classes/${classId}/`);
      alert('Class deleted!');
      fetchMyClasses();
    } catch (err) {
      console.error(err);
      alert('Error deleting class.');
    }
  };

  if (!user) {
    return <p className="muted-text">Loading trainer profile…</p>;
  }

  return (
    <div className="page section panel-page">
      <div className="section-header page-header">
        <div>
          <span className="chip accent">Trainer workspace</span>
          <h2 className="section-title">Design impactful sessions</h2>
          <p className="section-subtitle">
            Create new classes and maintain your schedule in one streamlined view.
          </p>
        </div>
      </div>

      <section className="surface-card panel-card">
        <h3>Create a class</h3>
        <p className="panel-note">Describe your session, set the capacity, and choose if it&apos;s group-based or individual.</p>
        <form onSubmit={createClass} className="form-stacked">
          <div className="form-field">
            <label htmlFor="class-name">Class name</label>
            <input
              id="class-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="class-description">Description</label>
            <textarea
              id="class-description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="class-date">Date &amp; time</label>
            <input
              id="class-date"
              type="datetime-local"
              name="date_time"
              value={formData.date_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="class-type">Class type</label>
            <select
              id="class-type"
              name="class_type"
              value={formData.class_type}
              onChange={handleChange}
            >
              <option value="group">Group</option>
              <option value="individual">Individual</option>
            </select>
          </div>

          {formData.class_type === 'group' ? (
            <div className="form-field">
              <label htmlFor="class-capacity">Capacity</label>
              <input
                id="class-capacity"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min={1}
              />
            </div>
          ) : (
            <div className="form-field">
              <label htmlFor="class-user">Select user (1-on-1)</label>
              <select
                id="class-user"
                name="selected_user"
                value={formData.selected_user}
                onChange={handleChange}
              >
                <option value="">Choose user</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Publish class
            </button>
            <button type="button" className="btn-ghost" onClick={resetForm}>
              Reset form
            </button>
          </div>
        </form>
      </section>

      <section className="surface-card panel-card">
        <h3>My created classes</h3>
        {myClasses.length === 0 ? (
          <div className="empty-state">
            <h3>No classes yet</h3>
            <p className="muted-text">Create your first class to invite members or schedule private sessions.</p>
          </div>
        ) : (
          <div className="panel-list">
            {myClasses.map((gc) => (
              <div className="panel-list-item" key={gc.id}>
                <header>
                  <h4>{gc.name}</h4>
                  <button type="button" className="btn-danger" onClick={() => handleDeleteClass(gc.id)}>
                    Delete
                  </button>
                </header>
                <div className="muted-text" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
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

export default TrainerPanel;
