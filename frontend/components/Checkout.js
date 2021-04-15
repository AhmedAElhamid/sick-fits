import React, { useState } from 'react';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import nProgress from 'nprogress';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import SickButton from './styles/SickButton';
import { CURRENT_USER_QUERY } from './User';
import { useCart } from '../lib/cartState';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;
const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

function CheckoutForm(props) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [checkout, { error: checkoutError }] = useMutation(
    CREATE_ORDER_MUTATION
  );
  const router = useRouter();
  const { closeCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    nProgress.start();
    const {
      error: stripeError,
      paymentMethod,
    } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (stripeError || checkoutError) {
      setError(stripeError || checkoutError);
      nProgress.done();
      return;
    }
    setError({});
    console.log(paymentMethod); // test card 4242 4242 4242 4242 02/22 222 22222

    const order = await checkout({
      variables: { token: paymentMethod.id },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });
    setLoading(false);
    closeCart();
    nProgress.done();
  };
  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <h4 style={{ color: 'red' }}>{error.message}</h4>}
      <CardElement />
      <SickButton>Checkout</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
