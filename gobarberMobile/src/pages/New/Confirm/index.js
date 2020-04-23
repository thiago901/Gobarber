import React, { useMemo } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Container, Avatar, Name, Time, SubmitButton } from './styles';
import Background from '~/components/Background';

import api from '~/services/api';

export default function SelectProvider({ route, navigation }) {
  const { provider, time } = route.params;
  const dateFormatted = useMemo(
    () => formatRelative(parseISO(time), new Date(), { locale: pt }),
    [time]
  );
  async function handleAppointment() {
    await api.post('/appointment', {
      provider_id: provider.id,
      date: time,
    });
    navigation.popToTop();
    navigation.navigate('Dashboad');
  }
  return (
    <Background>
      <Container>
        <Avatar
          source={{
            uri: provider.avatar
              ? provider.avatar.url
              : `https://api.adorable.io/avatars/180/${provider.name}.png`,
          }}
        />
        <Name>{provider.name}</Name>
        <Time>{dateFormatted}</Time>

        <SubmitButton onPress={handleAppointment}>
          Confirmar agendamento
        </SubmitButton>
      </Container>
    </Background>
  );
}
