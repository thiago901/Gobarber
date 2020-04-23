import { all, call, put, takeLatest } from 'redux-saga/effects';
import { Alert } from 'react-native';
import api from '~/services/api';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;
    const response = yield call(api.post, 'session', {
      email,
      password,
    });
    const { token, user } = response.data;

    if (user.provider) {
      Alert.alert('Erro no login', 'Usurario nao pode ser prestador');
      return;
    }
    api.defaults.headers.Authorization = `bearer ${token}`;
    yield put(signInSuccess(token, user));
    // history.push('/dashboard');
  } catch (error) {
    Alert.alert('Erro ao autenticar', 'Verifique seus dados e tente novamente');
    yield put(signFailure());
  }
}
export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;
    yield call(api.post, 'users', {
      name,
      email,
      password,
    });
    // history.push('/');
  } catch (error) {
    Alert.alert('Erro no cadastro', 'Verifique seus dados e tente novamente');
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `bearer ${token}`;
  }
}

export function signOut() {
  // history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
