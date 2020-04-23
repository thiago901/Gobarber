import React, { useState, useEffect } from 'react';

import { Container, HourList, HourItem, HourTitle } from './styles';
import Background from '~/components/Background';
import DataInput from '~/components/DataInput';
import api from '~/services/api';

export default function SelectDataTime({ route, navigation }) {
  const provider = route.params.item;
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState([]);

  useEffect(() => {
    async function load() {
      const response = await api.get(`/providers/${provider.id}/available`, {
        params: { date: date.getTime() },
      });

      setHours(response.data);
    }
    load();
  }, [provider.id, date]);

  function handleSelectTime(time) {
    navigation.navigate('ConfirmHour', {
      provider,
      time,
    });
  }
  return (
    <Background>
      <Container>
        <DataInput date={date} onChange={setDate} />
        <HourList
          data={hours}
          keyExtrator={(item) => item.time}
          renderItem={({ item }) => (
            <HourItem
              onPress={() => item.available && handleSelectTime(item.value)}
              enable={item.available}
            >
              <HourTitle>{item.time}</HourTitle>
            </HourItem>
          )}
        />
      </Container>
    </Background>
  );
}
