import React, { useEffect } from 'react';
import Joi from 'joi-browser';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Form from './styles/Form';
import Input from './common/Input';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY, useUser } from './User';
import DisplayError from './ErrorMessage';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          name
          email
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

function SignIn() {
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user?.email) router.push('/');
  }, [user]);
  const [signInMutation, { data, error, loading }] = useMutation(
    SIGNIN_MUTATION
  );

  const schema = {
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().min(8).required().label('Password'),
  };
  const doSubmit = async () => {
    await signInMutation({
      variables: inputs,
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });
    if (!error) handleClear();
  };

  const {
    inputs,
    errors,
    handleChange,
    handleSubmit,
    validate,
    handleClear,
  } = useForm(
    {
      email: '',
      password: '',
    },
    schema,
    doSubmit
  );

  return (
    <Form>
      {error && <DisplayError error={error} />}
      {data && !data.authenticateUserWithPassword.item && (
        <DisplayError error={{ message: 'Email or Password is incorrect' }} />
      )}
      <fieldset aria-busy={loading}>
        <Input
          name="email"
          label="Email"
          placeholder="Email"
          autoComplete="email"
          value={inputs.email}
          inputs={inputs}
          error={errors?.email}
          handleChange={handleChange}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="password"
          value={inputs.password}
          inputs={inputs}
          error={errors.password}
          handleChange={handleChange}
        />
        <button disabled={validate()} type="submit" onClick={handleSubmit}>
          Sign In
        </button>
      </fieldset>
    </Form>
  );
}

export default SignIn;
