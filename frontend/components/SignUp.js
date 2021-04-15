import React, { useEffect } from 'react';
import Joi from 'joi-browser';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Router, { useRouter } from 'next/router';
import Form from './styles/Form';
import Input from './common/Input';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY, useUser } from './User';
import DisplayError from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, password: $password, name: $name }) {
      id
      name
      email
    }
  }
`;

function SignUp() {
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user?.email) router.push('/');
  }, [user]);
  const [signUpMutation, { data, error, loading }] = useMutation(
    SIGNUP_MUTATION
  );

  const schema = {
    email: Joi.string().email().required().label('Email'),
    name: Joi.string().required().label('Username'),
    password: Joi.string().min(8).required().label('Password'),
    repeat_password: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .label('Confirmation Password')
      .options({ language: { any: { allowOnly: 'must match password' } } }),
  };
  const doSubmit = async () => {
    await signUpMutation({
      variables: {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }).catch((e) => console.log(e));
    console.log({ data, loading, error });
  };

  const { inputs, errors, handleChange, handleSubmit, validate } = useForm(
    {
      email: '',
      name: '',
      password: '',
      repeat_password: '',
    },
    schema,
    doSubmit
  );

  return (
    <Form>
      <fieldset aria-busy={loading}>
        {error && <DisplayError error={error} />}
        <Input
          name="name"
          label="Username"
          placeholder="Username"
          autoComplete="name"
          value={inputs.name}
          inputs={inputs}
          error={errors?.name}
          handleChange={handleChange}
        />
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
        <Input
          name="repeat_password"
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          autoComplete="password"
          value={inputs.repeat_password}
          inputs={inputs}
          error={errors.repeat_password}
          handleChange={handleChange}
        />
        <button disabled={validate()} type="submit" onClick={handleSubmit}>
          Sign Up
        </button>
      </fieldset>
    </Form>
  );
}

export default SignUp;
