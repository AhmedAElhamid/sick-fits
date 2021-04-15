import React from 'react';
import Joi from 'joi-browser';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import Form from './styles/Form';
import Input from './common/Input';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      password: $password
      email: $email
      token: $token
    ) {
      code
      message
    }
  }
`;

function Reset({ token }) {
  const [reset, { data, loading }] = useMutation(RESET_MUTATION);

  const schema = {
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().min(8).required().label('Password'),
    token: Joi.string().alphanum().min(5).max(200).required().label('Token'),
  };

  const error = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  const doSubmit = async () => {
    await reset({
      variables: {
        email: inputs.email,
        password: inputs.password,
        token: inputs.token,
      },
    }).catch((e) => console.log(e));
  };

  const { inputs, errors, handleChange, handleSubmit, validate } = useForm(
    {
      email: '',
      password: '',
      token,
    },
    schema,
    doSubmit
  );

  return (
    <Form>
      <fieldset aria-busy={loading}>
        {error && <DisplayError error={error} />}
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success! password updated, go ahead and sign in</p>
        )}
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
          label="New Password"
          type="password"
          placeholder="Password"
          autoComplete="password"
          value={inputs.password}
          inputs={inputs}
          error={errors?.password}
          handleChange={handleChange}
        />
        <button disabled={validate()} type="submit" onClick={handleSubmit}>
          Reset
        </button>
      </fieldset>
    </Form>
  );
}

export default Reset;
