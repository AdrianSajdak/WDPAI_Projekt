import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import useAuth from '../hooks/useAuth';

function TrainerPanel() {
  const { user } = useAuth();
  const [myClasses, setMyClasses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    capacity: 10,
    class_type: 'group',
    selected_user: '',
  });

  useEffect(() => {
    fetchMyClasses();
    fetchAllUsers();
  }, []);

  const fetchMyClasses = async () => {
    try {
      const res = await axiosClient.get('/classes/');
      // filter: only classes where trainer == user.id
      const trainerClasses = res.data.filter((gc) => gc.trainer === user.id);
      setMyClasses(trainerClasses);
    } catch (err) {
      console.error(err);
      alert('Could not fetch your classes.');
    }
  };

  // Deleting class (only if we are trainer or admin)
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
        start_time: formData.start_time,
        end_time: formData.end_time,
        class_type: formData.class_type,
      };

      if (formData.class_type === 'group') {
        postData.capacity = Number(formData.capacity);
      } else {
        // individual
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
      start_time: '',
      end_time: '',
      capacity: 10,
      class_type: 'group',
      selected_user: '',
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Trainer Panel</h2>
      <p>Hello, {user?.username}! Create and manage your classes here.</p>

      <section style={{ marginBottom: '2rem' }}>
        <h3>Create a New Class</h3>
        <form
          onSubmit={createClass}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.5rem',
            margin: '0 auto',
          }}
        >
          <label>
            Class Name:
            <br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description:
            <br />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </label>

          <label>
            Start time:
            <br />
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            End time:
            <br />
            <input
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Class type:
            <br />
            <select
              name="class_type"
              value={formData.class_type}
              onChange={handleChange}
            >
              <option value="group">Group</option>
              <option value="individual">Individual</option>
            </select>
          </label>

          {formData.class_type === 'group' ? (
            <label>
              Capacity:
              <br />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
              />
            </label>
          ) : (
            <label>
              Select User (for 1-on-1):
              <br />
              <select
                name="selected_user"
                value={formData.selected_user}
                onChange={handleChange}
              >
                <option value="">-- choose user --</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </label>
          )}

          <button
            type="submit"
            className="btn-green"
            style={{ marginTop: '1rem' }}
          >
            Create Class
          </button>
        </form>
      </section>

      <section>
        <h3>My Created Classes</h3>
      {myClasses.length === 0 ? (
        <p>You have not created any classes yet.</p>
      ) : (
        <ul>
          {myClasses.map(gc => (
            <li key={gc.id} style={{ marginBottom: '1rem' }}>
              <strong>{gc.name}</strong>
              <br />
              Trainer: {gc.trainer_name}
              <br />
              {gc.start_local} – {gc.end_local}
              <br />
              Capacity: {gc.capacity}
              <button onClick={() => handleDeleteClass(gc.id)}>Delete</button>
            </li>
          ))}
        </ul>
        )}
      </section>
    </div>
  );
}

export default TrainerPanel;
