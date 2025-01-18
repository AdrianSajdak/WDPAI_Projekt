import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import useAuth from '../hooks/useAuth';

function TrainerPanel() {
  const { user } = useAuth();  // np. do wyświetlenia nazwy
  const [myClasses, setMyClasses] = useState([]);
  
  // Stan formularza
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    capacity: 10,
    class_type: 'group',
  });

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      // Zakładamy, że backend wspiera filtr: /api/classes/?my=1 
      // lub zwraca wszystkie i filtrujemy w JS
      const res = await axiosClient.get('/classes/');
      // Filtrowanie: tylko te, gdzie trainer == user.id 
      const userId = user?.id;
      const userClasses = res.data.filter(c => c.trainer === userId);
      setMyClasses(userClasses);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const createClass = async (e) => {
    e.preventDefault();
    try {
      // Wystarczy POST /classes/ z formData
      // W backendzie w perform_create: trainer=request.user
      await axiosClient.post('/classes/', formData);
      alert('Utworzono nowe zajęcia!');
      setFormData({
        name: '',
        description: '',
        start_time: '',
        end_time: '',
        capacity: 10,
        class_type: 'group',
      });
      fetchMyClasses();
    } catch (err) {
      console.error(err);
      alert('Błąd przy tworzeniu zajęć.');
    }
  };

  return (
    <div>
      <h2>Panel Trenera</h2>
      <p>Witaj, {user?.username}! Możesz planować nowe zajęcia.</p>

      <section style={{ marginBottom: '2rem' }}>
        <h3>Utwórz nowe zajęcia</h3>
        <form onSubmit={createClass} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <label>Nazwa</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Opis</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />

          <label>Data rozpoczęcia</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />

          <label>Data zakończenia</label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />

          <label>Pojemność (capacity)</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />

          <label>Rodzaj zajęć</label>
          <select name="class_type" value={formData.class_type} onChange={handleChange}>
            <option value="group">Grupowe</option>
            <option value="individual">Indywidualne</option>
          </select>

          <button type="submit" style={{ marginTop: '1rem' }}>Utwórz zajęcia</button>
        </form>
      </section>

      <section>
        <h3>Moje zaplanowane zajęcia</h3>
        {myClasses.length === 0 ? (
          <p>Brak zajęć.</p>
        ) : (
          <ul>
            {myClasses.map(c => (
              <li key={c.id}>
                <strong>{c.name}</strong> ({c.class_type}) 
                <br />od {c.start_time} do {c.end_time}, capacity={c.capacity}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default TrainerPanel;