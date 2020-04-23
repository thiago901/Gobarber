import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import logo from '~/assets/logo.svg';
// import { Container } from './styles';

import { signRequest } from '~/store/modules/auth/actions';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail valido')
    .required('O email é obrigatorio'),
  password: Yup.string()
    .min(8, 'A senha deve ter no minimo 8 caracters')
    .required('A senha é obrigatoria'),
});

export default function Signin() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  function handleSubmit({ email, password }) {
    dispatch(signRequest(email, password));
  }
  return (
    <>
      <img src={logo} alt="logo" />
      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="email" type="text" placeholder="Seu e-mail" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />
        <button type="submit">{loading ? 'Carregando...' : 'Acessar'}</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  );
}
