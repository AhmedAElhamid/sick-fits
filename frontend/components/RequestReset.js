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

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

function RequestReset() {
  const [requestPasswordReset, { data, error, loading }] = useMutation(
    REQUEST_RESET_MUTATION
  );

  const schema = {
    email: Joi.string().email().required().label('Email'),
  };
  const doSubmit = async () => {
    await requestPasswordReset({
      variables: {
        email: inputs.email,
      },
    }).catch((e) => console.log(e));
  };

  const { inputs, errors, handleChange, handleSubmit, validate } = useForm(
    {
      email: '',
    },
    schema,
    doSubmit
  );

  return (
    <Form>
      <fieldset aria-busy={loading}>
        {error && <DisplayError error={error} />}
        {data?.sendUserPasswordResetLink === null && (
          <p>Check your Email for the link!</p>
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
        <button disabled={validate()} type="submit" onClick={handleSubmit}>
          Reset Password
        </button>
      </fieldset>
    </Form>
  );
}

export default RequestReset;
