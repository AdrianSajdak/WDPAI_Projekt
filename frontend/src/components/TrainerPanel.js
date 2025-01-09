import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

function TrainerPanel() {
  const [myClasses, setMyClasses] = useState([]);

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      // Załóżmy, że backend ma filtr /classes/?my=1
      // albo pobieramy wszystkie i filtrujemy w kliencie
      const response = await axiosClient.get('/classes/?my=1');
      setMyClasses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createClass = async (data) => {
    try {
      await axiosClient.post('/classes/', data);
      fetchMyClasses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Panel Trenera</h2>
      <section>
        <h3>Moje zajęcia</h3>
        <ul>
          {myClasses.map(mc => (
            <li key={mc.id}>{mc.name} | {mc.start_time} - {mc.end_time}</li>
          ))}
        </ul>
        {/* Form do dodawania nowego zajęcia → createClass() */}
      </section>
    </div>
  );
}

export default TrainerPanel;
