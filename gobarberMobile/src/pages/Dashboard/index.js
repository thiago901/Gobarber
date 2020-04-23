import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import api from '~/services/api';
import { Container, Title, List } from './styles';
import Background from '~/components/Background';
import Appointment from '~/components/Appointment';

export default function Dashboard() {
  const [appointment, setAppointment] = useState([]);

  const isFocus = useIsFocused();

  async function load() {
    const response = await api.get('/appointment');
    setAppointment(response.data);
  }
  useEffect(() => {
    if (isFocus) {
      load();
    }
  }, [isFocus]);
  async function handleCancel(id) {
    const response = await api.delete(`/appointment/${id}`);

    setAppointment(
      appointment.map((ap) =>
        ap.id === id ? { ...ap, canceled_at: response.data.canceled_at } : ap
      )
    );
  }

  return (
    <Background>
      <Container>
        <Title>Agendamentos</Title>
        <List
          data={appointment}
          keyExtrator={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Appointment onCancel={() => handleCancel(item.id)} data={item} />
          )}
        />
      </Container>
    </Background>
  );
}
