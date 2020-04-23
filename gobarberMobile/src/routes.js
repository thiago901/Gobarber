import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { useSelector } from 'react-redux';

import { RectButton } from 'react-native-gesture-handler';
import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';
import Dashboard from '~/pages/Dashboard';
import Profile from '~/pages/Profile';

import SelectProvider from '~/pages/New/SelectProvider';
import SelectDataTime from '~/pages/New/SelectDataTime';
import Confirm from '~/pages/New/Confirm';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ButtonBack({ navigation }) {
  return (
    <RectButton
      onPress={() => {
        navigation.navigate('Dashboad');
      }}
      style={{ marginLeft: 20, padding: 10 }}
    >
      <Icon name="chevron-left" color="#fff" size={20} />
    </RectButton>
  );
}

function Agendamento({ route, navigation }) {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerTransparent: true,
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerLeft: () => <ButtonBack navigation={navigation} />,
      })}
    >
      <Stack.Screen
        name="Providers"
        component={SelectProvider}
        options={{
          title: 'Selecione um prestador',
        }}
      />
      <Stack.Screen
        name="SelectDataTime"
        component={SelectDataTime}
        options={{
          title: 'Selecione um horário',
        }}
      />
      <Stack.Screen
        name="ConfirmHour"
        component={Confirm}
        options={{
          title: 'Confirmação de agendamento',
        }}

        // options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function Routes() {
  const signed = useSelector((state) => state.auth.signed);
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      {!signed ? (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: '#fff',
            inactiveTintColor: 'rgba(255,255,255,0.6)',
            style: {
              backgroundColor: '#8d41a8',
            },
            keyboardHidesTabBar: true,
          }}
        >
          <Tab.Screen
            name="Dashboad"
            component={Dashboard}
            options={{
              title: 'Agendamentos',
              tabBarIcon: ({ color }) => (
                <Icon name="event" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Agendamento"
            component={Agendamento}
            options={{
              title: 'Agendar',
              tabBarIcon: ({ color }) => (
                <Icon name="add-circle-outline" size={20} color={color} />
              ),
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              title: 'Meu perfil',
              tabBarIcon: ({ color }) => (
                <Icon name="person" size={20} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

Agendamento.propTypes = {
  route: PropTypes.objectOf(PropTypes.object).isRequired,
};
