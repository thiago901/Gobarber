import React, { useEffect, useState } from 'react';

import { Container, ProviderList, Avatar, Provider, Name } from './styles';
import Background from '~/components/Background';

import api from '~/services/api';

export default function SelectProvider({ navigation }) {
  const [providers, setProviders] = useState([]);
  useEffect(() => {
    async function load() {
      const response = await api.get('/providers');
      setProviders(response.data);
    }
    load();
  }, []);
  return (
    <Background>
      <Container>
        <ProviderList
          data={providers}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Provider
              onPress={() => {
                navigation.navigate('SelectDataTime', { item });
              }}
            >
              {console.tron.warn(item)}
              <Avatar
                source={{
                  uri: item.avatar
                    ? item.avatar.url
                    : `https://api.adorable.io/avatars/50/${item.name}.png`,
                }}
              />
              <Name>{item.name}</Name>
            </Provider>
          )}
        />
      </Container>
    </Background>
  );
}
