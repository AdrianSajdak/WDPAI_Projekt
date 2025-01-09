import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

function AdminPanel() {
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [groupClasses, setGroupClasses] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const tRes = await axiosClient.get('/trainers/');
      const pRes = await axiosClient.get('/membership-plans/');
      const cRes = await axiosClient.get('/classes/');
      setTrainers(tRes.data);
      setPlans(pRes.data);
      setGroupClasses(cRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Przykład: dodanie nowego planu członkostwa
  const addMembershipPlan = async (planData) => {
    try {
      await axiosClient.post('/membership-plans/', planData);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Panel administratora</h2>

      <section>
        <h3>Trenerzy</h3>
        <ul>
          {trainers.map(tr => (
            <li key={tr.id}>{tr.user?.username} - {tr.specialization}</li>
          ))}
        </ul>
        {/* Form do dodawania trenera */}
      </section>

      <section>
        <h3>Plany członkostw</h3>
        <ul>
          {plans.map(pl => (
            <li key={pl.id}>{pl.name} - {pl.price} PLN</li>
          ))}
        </ul>
        {/* Form do dodawania planu, np. addMembershipPlan(...) */}
      </section>

      <section>
        <h3>Wszystkie zajęcia</h3>
        <ul>
          {groupClasses.map(gc => (
            <li key={gc.id}>{gc.name} (trener: {gc.trainer})</li>
          ))}
        </ul>
        {/* Form do dodawania zajęć */}
      </section>
    </div>
  );
}

export default AdminPanel;
